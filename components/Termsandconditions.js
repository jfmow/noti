import legal from '@/styles/Legal.module.css'
export default function Tc({ isOpen, onClose }) {
    const handleClose = (e) => {
        e.preventDefault()
        onClose()
    };
    if (!isOpen) {
        return ('')
    } else if (isOpen){
        document.body.classList.add("modal-open")
    }
    return (
        <div className={legal.container}>
            <ol>
                <h1>Welcome! By signing up, you agree to be bound by the following terms and conditions:</h1>
                <li>Eligibility: To sign up for our news website, you must be at least 13 years of age or have the consent of a parent or legal guardian.
                </li>
                <li>Account Information: When signing up, you must provide accurate and complete information, including your name, email address, and any other information required for registration. You are responsible for keeping your account information up-to-date.</li>
                <li>Username and Password: You are responsible for choosing a unique username and a secure password for your account. You should not share your login credentials with anyone else, and you must notify us immediately if you suspect any unauthorized access to your account.</li>
                <li>Content: By using our website, you agree to abide by all applicable laws and regulations. You also agree not to post any content that is defamatory, harassing, obscene, or otherwise objectionable. We reserve the right to remove any content that we believe violates these terms and conditions. If we become aware of any harmful content, including but not limited to content that incites violence, promotes hatred, or involves the exploitation of minors, we may remove such content and notify the relevant authorities if necessary.</li>
                <li>Intellectual Property: The content on our website, including text, graphics, logos, and images, is protected by copyright and other intellectual property laws. You may not copy, reproduce, distribute, or display any content from our website without our prior written consent.</li>
                <li>Privacy Policy: We take your privacy seriously and will only use your personal information in accordance with our privacy policy, which is incorporated by reference into these terms and conditions.</li>
                <li>Termination: We may terminate your account at any time without notice if we believe that you have violated these terms and conditions or for any other reason.</li>
                <li>Modification: We reserve the right to modify these terms and conditions at any time. If we make any material changes, we will notify you by email or by posting a notice on our website.</li>
                <li>Disclaimer of Warranties: Our website and its content are provided "as is" and without warranties of any kind, either express or implied. We make no representation or warranty that our website will be error-free, uninterrupted, or free from viruses or other harmful components.</li>
                <li>Limitation of Liability: To the fullest extent permitted by law, we shall not be liable for any damages whatsoever, including but not limited to direct, indirect, incidental, consequential, or punitive damages, arising out of or in connection with your use of our website.</li>
                <li>Governing Law: These terms and conditions shall be governed by and construed in accordance with the laws of New Zealand. Any dispute arising out of or in connection with these terms and conditions shall be subject to the exclusive jurisdiction of the courts of New Zealand.</li>
                <li>By clicking "I agree" or by using our website, you signify your agreement to these terms and conditions.</li>
            </ol>
            <button type="button" onClick={handleClose}>Close</button>
        </div>
    )
}