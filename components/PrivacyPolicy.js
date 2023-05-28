import legal from '@/styles/Legal.module.css'
export default function Pp({ isOpen, onClose }) {
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
            <h1>We take your privacy seriously and are committed to protecting your personal information. This privacy policy explains how we collect, use, and may disclose your personal information when you use our news website.</h1>
            <ol>
                <li>Information We Collect
                    We collect the following information when you sign up for our news website:
                    Your name and email address
                    Your location and IP address
                    Your device information, such as browser type and version, operating system, and screen resolution
                </li>

                <li>
                    How We Use Your Information
                    We use your information for the following purposes:
                    To provide you with news and information that you have subscribed to
                    To personalize your experience on our website
                    To communicate with you about your account and our services
                    To analyze and improve our website and services
                    To comply with legal obligations and enforce our terms and conditions
                </li>

                <li>
                    Disclosure of Your Information
                    We may disclose your information to the following third parties:
                    Service providers who assist us in operating our website and providing our services
                    Law enforcement authorities, regulators, and other government agencies where required by law or to protect our rights and interests.
                    We do not sell, rent or trade your personal information to any third party for marketing purposes without your consent.
                </li>
                <li>
                    Cookies and Tracking Technologies
                    We use cookies and other tracking technologies to collect information about your use of our website. This information may include your device information, IP address and location. We use this information to analyze and improve our website and to provide you with relevant content. This information is stored on our servers until you delete your account.
                    It's important to note that in certain circumstances, such as if we suspect your account is being operated by a bot or if we have legal obligations to do so, we may also review your location data collected through cookies and tracking technologies.
                </li>
                <li>
                    Data Security
                    We take reasonable steps to protect your personal information from unauthorized access, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is completely secure, so we cannot guarantee absolute security.
                </li>
                <li>
                    Data Retention
                    We retain your personal information for as long as necessary to provide our news services and to comply with legal obligations. You can request deletion of your personal information by clicking on the "Delete My Account" button in your account settings.
                </li>
                <li>
                    Your Rights
                    You have the right to access, update, and delete your personal information. You also have the right to object to the processing of your personal information or to withdraw your consent at any time. To exercise these rights, please contact us using the details provided below.
                </li>
                <li>
                    Changes to this Privacy Policy
                    We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting a notice on our website.
                </li>
                <li>
                    Contact Us
                    If you have any questions or concerns about our privacy policy or our practices, please contact us at <strong>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</strong>.
                </li>
                Last updated: May 10, 2023
            </ol>
            <button type="button" onClick={handleClose}>Close</button>
        </div>
    )
}
