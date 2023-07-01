import legal from '@/styles/Legal.module.css'
export default function Tc({ isOpen, onClose }) {
    const handleClose = (e) => {
        e.preventDefault()
        onClose()
    };
    if (!isOpen) {
        return ('')
    } else if (isOpen) {
        document.body.classList.add("modal-open")
    }
    return (
        <div className={legal.container}>
            <ol>
                Terms of Service

                These Terms of Service ("Terms") govern your use of the note creation and storage website ("the Website") provided by [Company Name] ("we," "us," or "our"). By accessing or using the Website, you agree to be bound by these Terms. If you do not agree with these Terms, you must not use the Website.

                1. Account Registration
                1.1 To use certain features of the Website, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process.
                1.2 You are solely responsible for maintaining the confidentiality of your account information, including your username and password. You agree to notify us immediately of any unauthorized access to or use of your account.
                1.3 You must be at least 18 years old or have the legal capacity to enter into agreements in your jurisdiction to create an account.

                2. User Content
                2.1 The Website allows you to create, upload, store, and share notes, documents, or other content ("User Content").
                2.2 You retain ownership of your User Content. By uploading or sharing User Content on the Website, you grant us a non-exclusive, worldwide, royalty-free license to use, modify, reproduce, distribute, display, and perform your User Content in connection with the operation and promotion of the Website.
                2.3 You represent and warrant that you have all necessary rights to grant the license in Section 2.2 and that your User Content does not violate any laws or infringe upon the rights of any third party.
                2.4 We respect your privacy. The data stored on our servers will not be accessed by us unless:
                a) Required by applicable law, regulation, or legal process;
                b) Necessary to protect the rights, property, or safety of our users, the public, or us;
                c) Necessary to enforce these Terms or respond to a verified request from you.

                3. Prohibited Conduct
                3.1 When using the Website, you agree not to:
                a) Violate any applicable laws, regulations, or third-party rights;
                b) Upload, share, or transmit any harmful, offensive, defamatory, or illegal content;
                c) Interfere with the proper functioning of the Website or disrupt the experience of other users;
                d) Attempt to gain unauthorized access to any account or computer system;
                e) Engage in any fraudulent activity or impersonate any person or entity.

                4. Intellectual Property
                4.1 The Website and its content, including but not limited to text, graphics, logos, and software, are protected by intellectual property rights owned or licensed by us. You may not copy, modify, reproduce, distribute, or create derivative works based on the Website without our prior written consent.

                5. Limitation of Liability
                5.1 You understand and agree that your use of the Website is at your own risk. We shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of data, loss of profits, or business interruption, arising out of or in connection with the use or inability to use the Website.
                5.2 We do not warrant that the Website will be error-free, secure, or uninterrupted, or that any defects or errors will be corrected.
                5.3 In no event shall our total liability exceed the amount paid by you, if any, for accessing or using the Website.

                6. Modifications to the Terms
                6.1 We reserve the right to modify or update these Terms at any time without prior notice. Any changes to the Terms will be effective upon posting the revised version on the Website. It is your responsibility to review these Terms periodically for any changes.
                6.2 Your

                continued use of the Website after the modifications to the Terms will constitute your acceptance of such changes.

                7. Termination
                7.1 We may, in our sole discretion, suspend, restrict, or terminate your access to the Website, without liability or prior notice, for any reason, including but not limited to violation of these Terms or suspected misconduct.
                7.2 Upon termination, all provisions of these Terms that by their nature should survive termination shall survive, including but not limited to ownership provisions, warranty disclaimers, indemnity, and limitations of liability.

                8. Governing Law and Jurisdiction
                8.1 These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction]. Any dispute arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the courts of [Jurisdiction].

                9. Contact Us
                9.1 If you have any questions, concerns, or feedback regarding these Terms or the Website, please contact us at [contact email].

                By using the Website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </ol>
            <button type="button" onClick={handleClose}>Close</button>
        </div>
    )
}