import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for our application',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="prose prose-blue">
        <p className="mb-4">Last updated: April 24, 2025</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">Introduction</h2>
        <p>Welcome to our platform. These Terms of Service ("Terms") govern your use of our website and services. By accessing or using our service, you agree to be bound by these Terms.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">Use of Services</h2>
        <p>You must follow any policies made available to you within the Services. You may use our Services only as permitted by law. We may suspend or stop providing our Services to you if you do not comply with our terms or policies or if we are investigating suspected misconduct.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">User Accounts</h2>
        <p>When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding the password that you use to access our services and for any activities or actions under your password.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">Intellectual Property</h2>
        <p>Our service and its original content, features, and functionality are and will remain the exclusive property of our company and its licensors. Our service may contain content that is protected by copyright, trademark, and other laws. You may not modify, reproduce, distribute, create derivative works or adaptations of, publicly display or in any way exploit any of the content in whole or in part except as expressly authorized by us.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">Termination</h2>
        <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will immediately cease.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">Limitation of Liability</h2>
        <p>In no event shall we, our directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">Changes to Terms</h2>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">Governing Law</h2>
        <p>These Terms shall be governed and construed in accordance with the laws, without regard to its conflict of law provisions.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us.</p>
        
        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}