import requests
import sys
import json
from datetime import datetime

class VetroxAPITester:
    def __init__(self, base_url="https://wake-the-agent.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if not endpoint.startswith('http') else endpoint
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            self.test_results.append({
                'name': name,
                'method': method,
                'endpoint': endpoint,
                'expected_status': expected_status,
                'actual_status': response.status_code,
                'success': success,
                'response_preview': response.text[:200] if response.text else ''
            })

            return success, response.json() if success and response.text else {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout")
            self.test_results.append({
                'name': name,
                'method': method,
                'endpoint': endpoint,
                'expected_status': expected_status,
                'actual_status': 'TIMEOUT',
                'success': False,
                'error': 'Request timeout'
            })
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.test_results.append({
                'name': name,
                'method': method,
                'endpoint': endpoint,
                'expected_status': expected_status,
                'actual_status': 'ERROR',
                'success': False,
                'error': str(e)
            })
            return False, {}

    def test_health_endpoints(self):
        """Test basic health endpoints"""
        print("\n" + "="*50)
        print("TESTING HEALTH ENDPOINTS")
        print("="*50)
        
        # Test root endpoint
        self.run_test("API Root", "GET", "", 200)
        
        # Test health endpoint
        self.run_test("Health Check", "GET", "health", 200)

    def test_enquiry_endpoints(self):
        """Test enquiry-related endpoints"""
        print("\n" + "="*50)
        print("TESTING ENQUIRY ENDPOINTS")
        print("="*50)
        
        # Test enquiry submission with valid data
        enquiry_data = {
            "name": "Test Customer",
            "email": "test@example.com",
            "phone": "+61 400 000 000",
            "company": "Test Company",
            "enquiry_type": "General Enquiry",
            "message": "I would like a quote for full vehicle PPF protection for my BMW M3. Please contact me with pricing and availability."
        }
        
        success, response = self.run_test(
            "Submit Valid Enquiry",
            "POST",
            "enquiry",
            200,
            data=enquiry_data
        )
        
        enquiry_id = None
        if success and 'id' in response:
            enquiry_id = response['id']
            print(f"   Created enquiry ID: {enquiry_id}")
            
            # Verify email_sent status
            if 'email_sent' in response:
                if response['email_sent']:
                    print("   ✅ Gmail SMTP email sent successfully")
                else:
                    print("   ⚠️  Email not sent (check Gmail SMTP configuration)")
        
        # Test enquiry submission with minimal data
        minimal_enquiry = {
            "name": "Minimal Test",
            "email": "minimal@example.com",
            "message": "Just a basic enquiry"
        }
        
        self.run_test(
            "Submit Minimal Enquiry",
            "POST",
            "enquiry",
            200,
            data=minimal_enquiry
        )
        
        # Test enquiry submission with invalid email
        invalid_enquiry = {
            "name": "Invalid Email Test",
            "email": "invalid-email",
            "message": "Testing invalid email"
        }
        
        self.run_test(
            "Submit Invalid Email Enquiry",
            "POST",
            "enquiry",
            422,  # Validation error expected
            data=invalid_enquiry
        )
        
        # Test enquiry submission with missing required fields
        incomplete_enquiry = {
            "name": "Incomplete Test"
            # Missing email and message
        }
        
        self.run_test(
            "Submit Incomplete Enquiry",
            "POST",
            "enquiry",
            422,  # Validation error expected
            data=incomplete_enquiry
        )
        
        # Test reseller enquiry
        reseller_enquiry = {
            "name": "Potential Reseller",
            "email": "reseller@example.com",
            "phone": "+61 400 111 222",
            "company": "Test Reseller Company",
            "enquiry_type": "Become a Reseller",
            "message": "I am interested in becoming a Vetrox reseller. Please provide information about partnership opportunities and wholesale pricing."
        }
        
        self.run_test(
            "Submit Reseller Enquiry",
            "POST",
            "enquiry",
            200,
            data=reseller_enquiry
        )

    def test_admin_endpoints(self):
        """Test admin endpoints"""
        print("\n" + "="*50)
        print("TESTING ADMIN ENDPOINTS")
        print("="*50)
        
        # Test get all enquiries
        self.run_test("Get All Enquiries", "GET", "enquiries", 200)
        
        # Test contact info
        self.run_test("Get Contact Info", "GET", "contact-info", 200)

    def test_cors_and_headers(self):
        """Test CORS and header handling"""
        print("\n" + "="*50)
        print("TESTING CORS AND HEADERS")
        print("="*50)
        
        # Test OPTIONS request for CORS
        try:
            response = requests.options(f"{self.api_url}/enquiry", timeout=10)
            print(f"🔍 Testing CORS OPTIONS...")
            print(f"   Status: {response.status_code}")
            print(f"   CORS Headers: {dict(response.headers)}")
            
            cors_headers = [
                'Access-Control-Allow-Origin',
                'Access-Control-Allow-Methods',
                'Access-Control-Allow-Headers'
            ]
            
            cors_ok = any(header in response.headers for header in cors_headers)
            if cors_ok:
                print("   ✅ CORS headers present")
            else:
                print("   ⚠️  CORS headers missing")
                
        except Exception as e:
            print(f"   ❌ CORS test failed: {str(e)}")

    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*60)
        print("TEST SUMMARY")
        print("="*60)
        print(f"Tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Tests failed: {self.tests_run - self.tests_passed}")
        print(f"Success rate: {(self.tests_passed/self.tests_run*100):.1f}%" if self.tests_run > 0 else "No tests run")
        
        # Print failed tests
        failed_tests = [test for test in self.test_results if not test['success']]
        if failed_tests:
            print(f"\n❌ FAILED TESTS ({len(failed_tests)}):")
            for test in failed_tests:
                print(f"   • {test['name']}: Expected {test['expected_status']}, got {test.get('actual_status', 'ERROR')}")
                if 'error' in test:
                    print(f"     Error: {test['error']}")
        
        # Print passed tests
        passed_tests = [test for test in self.test_results if test['success']]
        if passed_tests:
            print(f"\n✅ PASSED TESTS ({len(passed_tests)}):")
            for test in passed_tests:
                print(f"   • {test['name']}")
        
        return self.tests_passed == self.tests_run

def main():
    print("🚀 Starting Vetrox PPF API Tests")
    print(f"Testing against: https://wake-the-agent.preview.emergentagent.com")
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    tester = VetroxAPITester()
    
    # Run all test suites
    tester.test_health_endpoints()
    tester.test_enquiry_endpoints()
    tester.test_admin_endpoints()
    tester.test_cors_and_headers()
    
    # Print summary and return exit code
    all_passed = tester.print_summary()
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())