import legal from '@/styles/Legal.module.css'
import Router from 'next/router'
export default function pp() {
    return (
        <div className="w-full h-full bg-zinc-50 text-zinc-800 p-7">
            <button aria-label='Back' className="flex items-center justify-center text-zinc-600 p-2 hover:bg-zinc-200 rounded" onClick={() => Router.back()}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z" /></svg></button>
            <ol>
                <h1>Privacy Policy</h1>
                <p>This Privacy Policy ("Policy") explains how savemynotes.net ("we," "us," or "our") collects, uses, discloses, and protects the personal information that you provide or that we collect when you access or use savemynotes.net ("the Website"). We are committed to safeguarding your privacy and ensuring the security of your personal information. By accessing or using the Website, you consent to the collection, use, and disclosure of your personal information as described in this Policy. If you do not agree with this Policy, please do not use the Website.</p>
                <h2>1. Information We Collect</h2>
                <ul>
                    <li>1.1 Personal Information: When you create an account or use certain features of the Website, we may collect personal information, such as your name, email address, and any other information you provide to us.</li>
                    <li>1.2 Usage Information: We may collect information about your use of the Website, including your IP address, browser type, operating system, referring URLs, and other technical information.</li>
                    <li>1.3 Cookies: We may use cookies and similar technologies to enhance your experience on the Website. You can set your browser to refuse all or some browser cookies, but this may affect the functionality of the Website.</li>
                    <li>1.4 Third-Party Services: We may receive information about you from third-party services that you authorize, such as social media platforms or authentication services.</li>
                </ul>
                <h2>2. Use of Information</h2>
                <ul>
                    <li>2.1 We use the information we collect for the following purposes:
                        <ul>
                            <li>a) To provide and improve the functionality of the Website.</li>
                            <li>b) To communicate with you and respond to your inquiries.</li>
                            <li>c) To personalize your experience on the Website.</li>
                            <li>d) To analyze and understand how users interact with the Website.</li>
                            <li>e) To enforce our Terms of Service and protect the rights, property, or safety of users or others.</li>
                        </ul>
                    </li>
                    <li>2.2 We will not sell, rent, or lease your personal information to third parties.</li>
                </ul>
                <h2>3. Disclosure of Information</h2>
                <ul>
                    <li>3.1 We may disclose your personal information to third parties in the following circumstances:
                        <ul>
                            <li>a) With your consent or at your direction.</li>
                            <li>b) To comply with legal obligations, such as responding to a court order or subpoena.</li>
                            <li>c) To protect our rights, property, or safety, or the rights, property, or safety of others.</li>
                            <li>d) To service providers or contractors who assist us in operating the Website and providing the requested services, subject to confidentiality obligations.</li>
                        </ul>
                    </li>
                    <li>3.2 We may also disclose aggregated, anonymized information that does not identify any individual.</li>
                </ul>
                <h2>4. Data Security</h2>
                <ul>
                    <li>4.1 We take reasonable measures to protect the security of your personal information and prevent unauthorized access, use, or disclosure. However, no method of transmission over the Internet or electronic storage is completely secure, and we cannot guarantee absolute security.</li>
                </ul>
                <h2>5. Retention of Information</h2>
                <ul>
                    <li>5.1 We will retain your personal information for as long as necessary to fulfill the purposes outlined in this Policy unless a longer retention period is required or permitted by law.</li>
                </ul>
                <h2>6. Third-Party Links</h2>
                <ul>
                    <li>6.1 The Website may contain links to third-party websites or services. We are not responsible for the privacy practices or content of those third parties. We encourage you to review the privacy policies of those third parties before providing any personal information.</li>
                </ul>
                <h2>7. Children's Privacy</h2>
                <ul>
                    <li>7.1 The Website is not intended for use by individuals under the age of 16. We do not knowingly collect personal information from individuals under 16 years of age. If you believe we have inadvertently collected personal information from a child under 16, please contact us, and we will promptly delete the information.</li>
                </ul>
                <h2>8. International Transfers</h2>
                <ul>
                    <li>8.1 Your personal information may be stored and processed in any country where we have facilities or in which we engage service providers. By using the Website, you consent to the transfer of information to countries outside of your country of residence, which may have different data protection rules.</li>
                </ul>
                <h2>9. Changes to the Privacy Policy</h2>
                <ul>
                    <li>9.1 We reserve the right to modify or update this Policy at any time. We will notify you of any material changes by posting the updated Policy on the Website. Your continued use of the Website after the effective date of the revised Policy constitutes your acceptance of the changes.</li>
                </ul>
                <h2>10. Contact Us</h2>
                <ul>
                    <li>10.1 If you have any questions, concerns, or requests regarding this Policy or the privacy practices of the Website, please contact us at legal@jamesmowat.com.</li>
                </ul>
                <p>This Privacy Policy is effective as of 02/07/2023.</p>
            </ol>
        </div>
    )
}