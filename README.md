![image](https://github.com/MhmoudYahia/SafeSteg/assets/94763036/a7f3b6a6-0005-4e08-97ca-a32587506258)


# Steganographer
This repository contains a steganographer web application that allows users to encode and decode text messages within image or audio files. The application consists of three main parts: the encode page, the decode page, and the public authority.

## 🧑🏼‍💻 Client  Tech Stack
- ReactJS
- React Redux
- reduxjs/toolkit
- Pug Templates (For Emails)
- Socket.io-Client
  
 ## 🧑🏼‍💻 Server  Tech Stack 
- NodeJS
- ExpressJs
- MongoDB 
- Mongoose
- Bcrypt.js
- JSON Web Tokens (JWT)


## Project Overview
The Steganographer project is a web application designed to facilitate secure communication by allowing users to hide and extract text messages within image or audio files. The application leverages symmetric encryption, an independent Public Authority, and various security features to ensure the confidentiality and integrity of the hidden messages. Users can encode messages into files, securely transfer the encoded files, and decode the hidden messages at the receiving end.


## Encode Page
The encode page is responsible for taking an image or audio file and encoding a text message within it. The user selects a file and enters the message they want to hide. The message is then encrypted using symmetric encryption to enhance security. The resulting encoded file is generated and made available for download.


## Decode Page
The decode page allows users to extract hidden text messages from encoded files. The user uploads the encoded file and the application decodes the message using the appropriate decryption algorithm. The decrypted message is then displayed to the user.


## Public Authority
The public authority serves as an independent entity that generates unique encryption keys for senders and receivers. To obtain a key, the sender visits the public authority and registers the email address of the intended recipient. The authority generates a unique key using a combination of random mouse movements made by the sender and cryptographic hashing. This key is then securely stored in the database along with the sender's and receiver's email addresses (referred to as key_doc). The public auth. will send a email to the receiver to inform him. To enhance security, these keys automatically vanish after 5 minutes. Therefore, the receiver must retrieve the key from the public authority before the 5-minute expiration period ends. Once the receiver obtains the unique key, both the sender and receiver possess the same key in a secure manner, minimizing the risk of hacking.


## Website Features
The steganographer website offers the following features to enhance security:

1. Authentication: The website incorporates a user authentication model using JSON Web Tokens (JWT). Users can sign up, log in, and log out of their accounts to access the encode and decode functionalities.
2. Secure Data Transfer: Cookies are utilized to securely transfer authentication tokens between the client and server, ensuring the integrity and confidentiality of user data.
3. User Profile: Users have the ability to update their profile information, including their profile image and personal data.


# Overview of the image steganography algorithm used in the code

### Encoding (hide secret message within the image):

1. The encodeImage function takes an image file, a secret message, and a key as input parameters.
   
2. The function creates a new image element and loads the image file.
   
3. Once the image is loaded, the encodeImageToCanvas function is called to perform the encoding.
   
4. In the encodeImageToCanvas function:
   
    - The key is converted to a binary representation, where each character is converted to its 8-bit binary representation.
    - A canvas element is created with the same dimensions as the image.
    - The image is drawn onto the canvas.
    - The canvas' pixel data is retrieved using getImageData.
    - The secret message is converted to binary, where each character is converted to its 8-bit binary representation.
    - The binary message is then embedded within the least significant bit of each color component (red, green, and blue) of the image pixels.
    - The binary key is used to determine which bit to embed based on a bitwise XOR operation.
    - After embedding the message, the modified pixel data is put back onto the canvas using putImageData.
    - The modified canvas is returned.
### Decoding (extract secret message from the encoded image):

1. The decodeImage function takes an encoded image file and the key used for encoding as input parameters.
   
2. Similar to the encoding process, the function creates an image element and loads the image file.
   
3. Once the image is loaded, the decodeImageFromCanvas function is called to perform the decoding.
   
4. In the decodeImageFromCanvas function:
   
    - The key is converted to a binary representation.
    - The canvas element is created and the image is drawn onto it.
    - The canvas' pixel data is retrieved using getImageData.
    - The binary message is extracted by comparing the least significant bit of each color component of the image pixels with the binary key using a bitwise XOR operation.
    - The binary message is then converted back to the original secret message by grouping 8 bits at a time and converting them to their corresponding characters.
    - The secret message is returned.
    
It's important to note that this implementation uses the least significant bit (LSB) technique, which means that the secret message is embedded in the least significant bit of each color component. This method ensures that the changes made to the image pixels are minimal and less likely to be visually detectable. However, it also limits the amount of data that can be encoded within the image, as the secret message must fit within the available LSBs.


## JWT Authentication using Cookies

JWT (JSON Web Token) authentication is a popular method used for securing web applications and APIs. It allows for stateless authentication by using digitally signed tokens to validate and authorize user requests. While JWTs are typically stored in the client-side, using cookies for JWT storage offers additional security benefits. This document provides a brief overview of JWT authentication using cookies.

How JWT Authentication Works:

1. User Authentication: When a user logs in to an application, their credentials are verified by the server. If the credentials are valid, a JWT is generated and signed using a secret key known only to the server.

1. Token Issuance: The signed JWT is then sent back to the client as a response. It contains three parts: header, payload, and signature. The header specifies the signing algorithm used, while the payload contains claims (e.g., user ID, expiration time) about the user. The signature is created by hashing the header, payload, and secret key together.

1. Token Storage: In traditional JWT authentication, the client stores the JWT in local storage or session storage. However, to enhance security and prevent cross-site scripting (XSS) attacks, storing JWTs in cookies is a recommended approach.

JWT Authentication with Cookies:

1. Set Cookie: When the client receives the JWT, it is typically stored in an HTTP-only cookie. An HTTP-only cookie is inaccessible to JavaScript, making it more secure against XSS attacks. The cookie should have a secure flag set if the application is served over HTTPS.

1. Cookie Transmission: With each subsequent request, the client automatically includes the JWT as a cookie in the request headers. The server can access the JWT from the cookie and verify its authenticity by checking the signature using the secret key.

1. Token Expiration: The JWT includes an expiration time (exp), after which it becomes invalid. The server should verify the expiration time and deny access if the token has expired. If needed, the server can issue a new JWT by following the authentication process.

Benefits of JWT Authentication with Cookies:

1. Improved Security: Storing JWTs in HTTP-only cookies mitigates the risk of XSS attacks as they cannot be accessed by malicious JavaScript code.

1. Simplicity: Using cookies for JWT storage eliminates the need for developers to handle the complexities of client-side token storage.

1. Cross-Domain Requests: Cookies are automatically sent with cross-domain requests, allowing for seamless authentication across multiple subdomains or separate applications.

1. Token Revocation: If necessary, JWTs stored in cookies can be easily revoked by deleting the cookie on the server-side, preventing further access.

JWT authentication using cookies combines the benefits of JWTs with the enhanced security offered by HTTP-only cookies. By securely storing JWTs on the client-side, developers can ensure the integrity and confidentiality of user authentication while simplifying the implementation process. 

## After Login 
![image](https://github.com/MhmoudYahia/SafeSteg/assets/94763036/a90a9973-3cf7-4f45-ba86-28ab25c67f2e)


## Step one, Go to the Auth to register (START UP AN AUTHORITY)
![image](https://github.com/MhmoudYahia/SafeSteg/assets/94763036/19e19a7c-fec0-4bfe-a660-7b4750b77ed2)


## Step two, Upload the image or the audio
![image](https://github.com/MhmoudYahia/SafeSteg/assets/94763036/59cd07e5-0ade-430c-85ce-736d2b28958b)


## Step three, save the image
![image](https://github.com/MhmoudYahia/SafeSteg/assets/94763036/c42e195c-5b96-48c0-9535-5a324ffd0d04)


## Step four, the receiver go to the public auth to check on the key with his email (CHECK ME)
![image](https://github.com/MhmoudYahia/SafeSteg/assets/94763036/9e3940a9-b48e-4413-98d3-cec0b9a222a2)


## Done. the receiver go to upload the file to get the message
![image](https://github.com/MhmoudYahia/SafeSteg/assets/94763036/74bcc58e-3a1b-42f3-a0d9-8851649bf2f7)


## Profile page
![image](https://github.com/MhmoudYahia/SafeSteg/assets/94763036/33c5c016-f292-4955-a7f3-50fc88a8963c)


## Auth. Forms
![image](https://github.com/MhmoudYahia/SafeSteg/assets/94763036/bfd14765-fe7b-493d-bb58-1c58fcb0d578)

![image](https://github.com/MhmoudYahia/SafeSteg/assets/94763036/a973beee-4bcb-417e-8df1-532d630a8ce9)

![image](https://github.com/MhmoudYahia/SafeSteg/assets/94763036/088c8b2a-26f1-4ef5-a8e4-4612c97d5b84)

![image](https://github.com/MhmoudYahia/SafeSteg/assets/94763036/71f2e134-32b6-49ef-9224-afe014eb9b7d)

![image](https://github.com/MhmoudYahia/SafeSteg/assets/94763036/e0ea3628-0bf6-49d2-bef8-94dd0eb3c639)

## Installation and Setup
### To run the steganographer web application locally, follow these steps:

1. Clone the repository: git clone <repository_url>
2. Navigate to the project directory: cd steganographer
3. Install the dependencies: npm install
4. Start the development server: npm start
5. Open your web browser and access the application at http://localhost:3000

## Conclusion
The steganographer project provides a web-based solution for securely hiding and extracting text messages within image and audio files. With its symmetric encryption, independent Public Authority, and security-focused features, the application offers a robust means of communication. You are welcome to explore the codebase and customize it to suit your specific requirements.

If you have any questions or concerns, please don't hesitate to contact the project maintainers at myehia162@gmail.com
