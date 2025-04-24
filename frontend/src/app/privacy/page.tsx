import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for our application',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="prose prose-blue">
        <p className="mb-4">Last updated: April 2, 2025</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">Introduction</h2>
        <p>We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">The Data We Collect</h2>
        <p>We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together as follows:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Identity Data: includes first name, last name, username or similar identifier</li>
          <li>Contact Data: includes email address and telephone numbers</li>
          <li>Technical Data: includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website</li>
          <li>Usage Data: includes information about how you use our website, products and services</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">How We Use Your Data</h2>
        <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Where we need to perform the contract we are about to enter into or have entered into with you</li>
          <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests</li>
          <li>Where we need to comply with a legal obligation</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">Data Security</h2>
        <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">Your Legal Rights</h2>
        <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Request access to your personal data</li>
          <li>Request correction of your personal data</li>
          <li>Request erasure of your personal data</li>
          <li>Object to processing of your personal data</li>
          <li>Request restriction of processing your personal data</li>
          <li>Request transfer of your personal data</li>
          <li>Right to withdraw consent</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">Contact Us</h2>
        <p>If you have any questions about this privacy policy or our privacy practices, please contact us.</p>
        
        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}