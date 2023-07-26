import legal from '@/styles/Legal.module.css'
import Router from 'next/router'
export default function pp() {
    return (
        <div className={legal.container}>
            <button className={legal.back} onClick={() => Router.back()}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z" /></svg></button>
            <ol>
            <h1>Important Notice: Beta App - Data Security and Service Availability.</h1>

Dear User,

We would like to inform you about the nature of our platform before you proceed with signing up. Please note that our application is currently in the proof of concept stage, and as such, certain limitations and risks exist that you should be aware of.

Firstly, it is crucial to understand that our platform is not yet a fully developed and stable service. While we are working diligently to improve its functionality and reliability, there is a possibility of encountering unexpected issues, including data loss or service disruptions.

In light of this, we want to reiterate that storing sensitive or confidential data on our platform is strongly discouraged. Given its experimental nature, we cannot guarantee the same level of security and data protection as more established services. We kindly request you to refrain from inputting sensitive information that you would not be comfortable with potentially being exposed or lost.

By continuing with the signup process, you acknowledge that this is a proof of concept app and accept the associated risks. We appreciate your understanding and participation as we work towards enhancing the stability and security of our platform.

If you have any questions or require further clarification, please do not hesitate to reach out to our <a href='mailto:help@jamesmowat.com'>support team</a>.

Thank you for your cooperation.
            </ol>
        </div>
    )
}