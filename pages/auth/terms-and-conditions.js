import Router from 'next/router'
export default function tc() {
    return (
        <div className="w-full h-full bg-zinc-50 text-zinc-800 p-7">
            <button aria-label='Back' className="flex items-center justify-center text-zinc-600 p-2 hover:bg-zinc-200 rounded" onClick={() => Router.back()}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z" /></svg></button>
            <ol>
                <h1>Terms of Service</h1>
                <p>These Terms of Service ("Terms") govern your use of savemynotes.net ("the Website") provided by SaveMyNotes ("we," "us," or "our"). By accessing or using the Website, you agree to be bound by these Terms. If you do not agree with these Terms, you must not use the Website.</p>
                <h2>1. Account Registration</h2>
                <ul>
                    <li>1.1 To use certain features of the Website, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process.</li>
                    <li>1.2 You are solely responsible for maintaining the confidentiality of your account information, including your username and password. You agree to notify us immediately of any unauthorized access to or use of your account.</li>
                    <li>1.3 You must be at least 16 years old or have the legal capacity to enter into agreements in your jurisdiction to create an account.</li>
                </ul>
                <h2>2. User Content</h2>
                <ul>
                    <li>2.1 The Website allows you to create, upload, store, and share notes, documents, or other content ("User Content").</li>
                    <li>2.2 You retain ownership of your User Content. By uploading or sharing User Content on the Website, you grant us a non-exclusive, worldwide, royalty-free license to use, modify, reproduce, distribute, display, and perform your User Content in connection with the operation and promotion of the Website.</li>
                    <li>2.3 You represent and warrant that you have all necessary rights to grant the license in Section 2.2 and that your User Content does not violate any laws or infringe upon the rights of any third party.</li>
                    <li>2.4 We respect your privacy. The data stored on our servers will not be accessed by us unless:
                        <ul>
                            <li>a) Required by applicable law, regulation, or legal process;</li>
                            <li>b) Necessary to protect the rights, property, or safety of our users, the public, or us;</li>
                            <li>c) Necessary to enforce these Terms or respond to a verified request from you.</li>
                        </ul>
                    </li>
                </ul>
                <h2>3. Prohibited Conduct</h2>
                <ul>
                    <li>3.1 When using the Website, you agree not to:
                        <ul>
                            <li>a) Violate any applicable laws, regulations, or third-party rights;</li>
                            <li>b) Upload, share, or transmit any harmful, offensive, defamatory, or illegal content;</li>
                            <li>c) Interfere with the proper functioning of the Website or disrupt the experience of other users;</li>
                            <li>d) Attempt to gain unauthorized access to any account or computer system;</li>
                            <li>e) Engage in any fraudulent activity or impersonate any person or entity.</li>
                        </ul>
                    </li>
                </ul>
                <h2>4. Intellectual Property</h2>
                <ul>
                    <li>4.1 The Website and its content, including but not limited to text, graphics, logos, and software, are protected by intellectual property rights owned or licensed by us. You may not copy, modify, reproduce, distribute, or create derivative works based on the Website without our prior written consent.</li>
                </ul>
                <h2>5. Limitation of Liability</h2>
                <ul>
                    <li>5.1 You understand and agree that your use of the Website is at your own risk. We shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of data, loss of profits, or business interruption, arising out of or in connection with the use or inability to use the Website.</li>
                    <li>5.2 We do not warrant that the Website will be error-free, secure, or uninterrupted, or that any defects or errors will be corrected.</li>
                    <li>5.3 In no event shall our total liability exceed the amount paid by you, if any, for accessing or using the Website.</li>
                </ul>
                <h2>6. Modifications to the Terms</h2>
                <ul>
                    <li>6.1 We reserve the right to modify or update these Terms at any time without prior notice. Any changes to the Terms will be effective upon posting the revised version on the Website. It is your responsibility to review these Terms periodically for any changes.</li>
                    <li>6.2 Your continued use of the Website after the modifications to the Terms will constitute your acceptance of such changes.</li>
                </ul>
                <h2>7. Termination</h2>
                <ul>
                    <li>7.1 We may, in our sole discretion, suspend, restrict, or terminate your access to the Website, without liability or prior notice, for any reason, including but not limited to violation of these Terms or suspected misconduct.</li>
                    <li>7.2 Upon termination, all provisions of these Terms that by their nature should survive termination shall survive, including but not limited to ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</li>
                </ul>
                <h2>8. Governing Law and Jurisdiction</h2>
                <ul>
                    <li>8.1 These Terms shall be governed by and construed in accordance with the laws of New Zealand. Any dispute arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the courts of New Zealand.</li>
                </ul>
                <h2>9. Contact Us</h2>
                <ul>
                    <li>9.1 If you have any questions, concerns, or feedback regarding these Terms or the Website, please contact us at legal@jamesmowat.com.</li>
                </ul>
                <p>By using the Website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p></ol>
        </div>
    )
}