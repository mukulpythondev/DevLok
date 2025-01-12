// utils/cryptoUtils.js

export const generateKeyPair = async () => {
    try {
      // Generate RSA key pair (public and private keys)
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 2048, // Length of the key in bits (2048 or higher recommended)
          publicExponent: new Uint8Array([1, 0, 1]), // Common public exponent for RSA
          hash: "SHA-256", // Hash function used for the encryption
        },
        true, // Whether the key is extractable (so it can be exported)
        ["encrypt", "decrypt"] // Usable for encryption and decryption
      );
  
      // Export the public key as a JWK (JSON Web Key) format for sending to the server
      const publicKey = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);
      // Export the private key as a JWK (for storage in localStorage)
      const privateKey = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey);
  
      // Store the private key securely in localStorage (consider using more secure storage mechanisms)
      localStorage.setItem("privateKey", JSON.stringify(privateKey));
  
      return publicKey; // Return the public key to send to the backend
    } catch (error) {
      console.error("Error generating key pair:", error);
      throw new Error("Key generation failed");
    }
  };
  const importPrivateKey = async () => {
    const privateKeyJwk = JSON.parse(localStorage.getItem("privateKey"));
    if (!privateKeyJwk) throw new Error("Private key not found in localStorage");
  
    return await window.crypto.subtle.importKey(
      "jwk", // Format of the key
      privateKeyJwk, // JWK object
      { name: "RSA-OAEP", hash: { name: "SHA-256" } }, // Algorithm details
      true, // Key can be exported
      ["decrypt"] // Key usage
    );
  };
  
 export const decryptMessage = async (encryptedMessage) => {
    try {
      const privateKey = await importPrivateKey();
      const encryptedBuffer = Uint8Array.from(atob(encryptedMessage), (c) =>
        c.charCodeAt(0)
      );
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        encryptedBuffer
      );
      return new TextDecoder().decode(decryptedBuffer);
    } catch (error) {
      console.error("Error decrypting message:", error);
      return "[Decryption Error]";
    }
  };
