package com.wallet.qubetics;
import static android.content.ContentValues.TAG;

import android.os.Environment;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import org.json.JSONException;
import org.json.JSONObject;


import java.io.File;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

import com.google.protobuf.ByteString;

import wallet.core.java.AnySigner;
import wallet.core.jni.Base58;
import wallet.core.jni.CoinType;
import wallet.core.jni.HDWallet;
import wallet.core.jni.PrivateKey;
import wallet.core.jni.SolanaAddress;
import wallet.core.jni.WalletConnectRequest;
import wallet.core.jni.proto.Common;
import wallet.core.jni.proto.Solana;
import wallet.core.jni.proto.WalletConnect;

public class CreateWallet extends ReactContextBaseJavaModule {
    CreateWallet(ReactApplicationContext context) {
        super(context);
        System.loadLibrary("TrustWalletCore");
    }

    @NonNull
    @Override
    public String getName() {
        return "CreateWallet";
    }

    @ReactMethod
    public void generateMnemonics(Callback callback)  {
        Log.d("CreateWallet", "Create event called with name: ");
        HDWallet wallet = new HDWallet(128,"");

        String mnemonics = wallet.mnemonic();
        JSONObject addresses = generateAdresses(mnemonics);
        callback.invoke(addresses.toString());

    }

    @ReactMethod
    public void generateAddressFromMnemonics(String mnemonics, Callback callback) {
        JSONObject addresses = generateAdresses(mnemonics);
        Log.d("CreateWallet", addresses.toString());
        callback.invoke(addresses.toString());
    }

    @ReactMethod
    public void clearGarbageCollection() {
        Log.d("clearGarbageCollection", "clearGarbageCollection called");
        System.runFinalization();
        Runtime.getRuntime().gc();
        System.gc();
    }

    @ReactMethod
    public void signSolanaTransaction(String pvtKey, String toAddress, String amount, String recentBlockhash, Callback callback){
        HDWallet hdWallet = new HDWallet(pvtKey, "");
        CoinType coinSol = CoinType.SOLANA;
        PrivateKey solanaPrivateKey = hdWallet.getKeyForCoin(coinSol);
        long amountLong = Long.parseLong(amount);
        Solana.Transfer transferMessage = Solana.Transfer.newBuilder()
                .setRecipient(toAddress)
                .setValue(amountLong)
                .build();
        // Create a signing input
        Solana.SigningInput signingInput = Solana.SigningInput.newBuilder()
                .setTransferTransaction(transferMessage)
                .setRecentBlockhash(recentBlockhash)
                .setPrivateKey(ByteString.copyFrom(solanaPrivateKey.data()))
                .setTxEncoding(Solana.Encoding.Base64)
                .build();
        try {
            // Sign the transaction
            Solana.SigningOutput output = AnySigner.sign(signingInput, CoinType.SOLANA, Solana.SigningOutput.parser());
            wallet.core.jni.proto.Solana.PubkeySignature signature = output.getSignatures(0);
            final JSONObject txnObj = new JSONObject();
            txnObj.put("rawTxn", output.getEncoded());
            txnObj.put("signature", signature.getSignature());
            callback.invoke(txnObj.toString());
        } catch (Exception e) {
            // Handle it.
            Log.e("Sign Coin Txn Error", e.toString());
        }
    }

    @ReactMethod
    public void signSolanaTokenTransaction(String pvtKey, String fromAddress, String toAddress, String tokenMintAddress, String amount, String recentBlockhash, String decimal, Callback callback) {
        HDWallet hdWallet = new HDWallet(pvtKey, "");
        CoinType coinSol = CoinType.SOLANA;
        PrivateKey solanaPrivateKey = hdWallet.getKeyForCoin(coinSol);
        long amountLong = Long.parseLong(amount);
        int decimalInt = Integer.parseInt(decimal);
//        String senderTokenAddress = getTokenAccount(tokenMintAddress, fromAddress);
//        String recipientTokenAddress = getTokenAccount(tokenMintAddress, toAddress);

        Solana.TokenTransfer tokenTransferMessage = Solana.TokenTransfer.newBuilder()
                .setTokenMintAddress(tokenMintAddress)
                .setSenderTokenAddress(fromAddress)
                .setRecipientTokenAddress(toAddress)
                .setAmount(amountLong) // Represents 0.004 since decimals = 6
                .setDecimals(decimalInt)
                .build();

        // Create a signing input for the token transfer
        Solana.SigningInput signingInput = Solana.SigningInput.newBuilder()
                .setTokenTransferTransaction(tokenTransferMessage)
                .setRecentBlockhash(recentBlockhash)
                .setPrivateKey(ByteString.copyFrom(solanaPrivateKey.data()))
                .setTxEncoding(Solana.Encoding.Base64)
                .build();

        try {
            // Sign the transaction
            Solana.SigningOutput output = AnySigner.sign(signingInput, CoinType.SOLANA, Solana.SigningOutput.parser());
            wallet.core.jni.proto.Solana.PubkeySignature signature = output.getSignatures(0);
            final JSONObject txnObj = new JSONObject();
            txnObj.put("rawTxn", output.getEncoded());
            txnObj.put("signature", signature.getSignature());
            callback.invoke(txnObj.toString());
        } catch (Exception e) {
            // Handle it.
            Log.e("Sign Token Txn Error", e.toString());
        }
    }

    @ReactMethod
    public void createTokenAccountSigner(String pvtKey, String mainAddress, String tokenMintAddress, String tokenAddress, String recentBlockhash, Callback callback) {
        HDWallet hdWallet = new HDWallet(pvtKey, "");
        CoinType coinSol = CoinType.SOLANA;
        PrivateKey solanaPrivateKey = hdWallet.getKeyForCoin(coinSol);
        Solana.CreateTokenAccount createAccountMessage = Solana.CreateTokenAccount.newBuilder()
                .setMainAddress(mainAddress)
                .setTokenMintAddress(tokenMintAddress)
                .setTokenAddress(tokenAddress)
                .build();

        // Create the signing input
        Solana.SigningInput signingInput = Solana.SigningInput.newBuilder()
                .setCreateTokenAccountTransaction(createAccountMessage)
                .setRecentBlockhash(recentBlockhash)
                .setPrivateKey(ByteString.copyFrom(solanaPrivateKey.data()))
                .setTxEncoding(Solana.Encoding.Base64)
                .setPriorityFeePrice(Solana.PriorityFeePrice.newBuilder().setPrice(10000).build())
                .setPriorityFeeLimit(Solana.PriorityFeeLimit.newBuilder().setLimit(1000000).build())
                .build();

        try {
            // Sign the transaction
            Solana.SigningOutput output = AnySigner.sign(signingInput, CoinType.SOLANA, Solana.SigningOutput.parser());
            wallet.core.jni.proto.Solana.PubkeySignature signature = output.getSignatures(0);
            final JSONObject txnObj = new JSONObject();
            txnObj.put("rawTxn", output.getEncoded());
            txnObj.put("signature", signature.getSignature());
            callback.invoke(txnObj.toString());
        } catch (Exception e) {
            // Handle it.
            Log.e("Sign Token Txn Error", e.toString());
        }
    }
    @ReactMethod
    public void signSolanaWalletConnectRequest(String pvtKey, String requestPayload, Callback callback){
        HDWallet hdWallet = new HDWallet(pvtKey, "");
        CoinType coinSol = CoinType.SOLANA;
        PrivateKey solanaPrivateKey = hdWallet.getKeyForCoin(coinSol);

        String payload = "{\"transaction\":\"\"}";
        String finalPayload = payload.substring(0, 16) + requestPayload + payload.substring(16);
        System.out.println("Signed transaction finalPayload: " + finalPayload);
        // Step 1: Parse a signing request received through WalletConnect.
        WalletConnect.ParseRequestInput parsingInput = WalletConnect.ParseRequestInput.newBuilder()
                .setMethod(WalletConnect.Method.SolanaSignTransaction)
                .setPayload(finalPayload)
                .build();

        // Step 2: Parse the WalletConnect request.
        byte[] parsingOutputBytes = WalletConnectRequest.parse(CoinType.SOLANA, parsingInput.toByteArray());
        WalletConnect.ParseRequestOutput parsingOutput;
        try {
            parsingOutput = WalletConnect.ParseRequestOutput.parseFrom(parsingOutputBytes);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse output: " + e.getMessage(), e);
        }

        // Check for parsing errors.
        if (parsingOutput.getError() != Common.SigningError.OK) {
            throw new RuntimeException("Parsing error: " + parsingOutput.getError());
        }

        // Step 3: Set missing fields for the signing input.
        Solana.SigningInput signingInput = parsingOutput.getSolana().toBuilder()
                .setPrivateKey(ByteString.copyFrom(solanaPrivateKey.data()))
                .setTxEncoding(Solana.Encoding.Base64)
                .build();

        try {
            // Step 4: Sign the transaction.
            Solana.SigningOutput output = AnySigner.sign(signingInput, CoinType.SOLANA, Solana.SigningOutput.parser());
            wallet.core.jni.proto.Solana.PubkeySignature signature = output.getSignatures(0);
            final JSONObject txnObj = new JSONObject();
            txnObj.put("rawTxn", output.getEncoded());
            txnObj.put("signature", signature.getSignature());
            callback.invoke(txnObj.toString());
        }catch (Exception e) {
            Log.e("Sign Wallet Connect Txn Error", e.toString());
        }


    }

    public JSONObject generateAdresses(String mnemonics) {
        try {
            HDWallet hdWallet = new HDWallet(mnemonics, "");
            CoinType coinEth = CoinType.ETHEREUM;
            CoinType coinBtc = CoinType.BITCOIN;

            String ethSeeds = null;
            String btcSeeds = null;

            byte[] solanaPrivateKey = getSolanaPrivateKey(hdWallet);

            // Convert to a hex string for easy viewing or storage
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                ethSeeds = Base64.getEncoder().encodeToString(hdWallet.getKeyForCoin(coinEth).data());
                btcSeeds = toWIF(hdWallet.getKeyForCoin(coinBtc).data(), true);
            }

            final JSONObject objectBTC = new JSONObject();
            final JSONObject objectETH = new JSONObject();
            try {
                objectBTC.put("address", hdWallet.getAddressForCoin(coinBtc));
                objectBTC.put("pvtKey", btcSeeds);
            } catch (JSONException e) {
                Log.e(TAG, "Failed to create JSONObject", e);
            }
            try {
                objectETH.put("address", hdWallet.getAddressForCoin(coinEth));
                objectETH.put("pvtKey", ethSeeds);
            } catch (JSONException e) {
                Log.e(TAG, "Failed to create JSONObject", e);
            }



            final JSONObject addresses = new JSONObject();
            try {
                // With put you can add a name/value pair to the JSONObject
                addresses.put("eth", objectETH);
                addresses.put("btc", objectBTC);
                addresses.put("mnemonics", mnemonics);
            } catch (JSONException e) {
                Log.e(TAG, "Failed to create JSONObject", e);
            }

            return addresses;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String toWIF(byte[] keyData, boolean compressed) {
        // Add version prefix (0x80 for Bitcoin mainnet)
        byte[] versionedKey = new byte[keyData.length + 1];
        versionedKey[0] = (byte) 0x80;
        System.arraycopy(keyData, 0, versionedKey, 1, keyData.length);

        // Add compression flag (0x01) if compressed
        byte[] keyWithCompression;
        if (compressed) {
            keyWithCompression = new byte[versionedKey.length + 1];
            System.arraycopy(versionedKey, 0, keyWithCompression, 0, versionedKey.length);
            keyWithCompression[versionedKey.length] = 0x01;
        } else {
            keyWithCompression = versionedKey;
        }

        // Perform double SHA-256 for checksum
        MessageDigest sha256Digest = null;//getInstance("SHA-256");
        try {
            sha256Digest = MessageDigest.getInstance("SHA-256");
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
        byte[] hash1 = sha256Digest.digest(keyWithCompression);
        byte[] hash2 = sha256Digest.digest(hash1);

        // Take the first 4 bytes as the checksum
        byte[] checksum = new byte[4];
        System.arraycopy(hash2, 0, checksum, 0, 4);

        // Concatenate key with checksum
        byte[] wifBytes = new byte[keyWithCompression.length + checksum.length];
        System.arraycopy(keyWithCompression, 0, wifBytes, 0, keyWithCompression.length);
        System.arraycopy(checksum, 0, wifBytes, keyWithCompression.length, checksum.length);

        // Encode the result to Base58
        return Base58.encodeNoCheck(wifBytes);
    }

    public static byte[] getSolanaPrivateKey(HDWallet hdWallet) {
        // Get the private key for Solana from the HD wallet
        PrivateKey solanaPrivateKey = hdWallet.getKeyForCoin(CoinType.SOLANA);

        // Extract the raw private key bytes (32 bytes for the private key)
        byte[] privateKeyData = solanaPrivateKey.data();

        // Check the length of the private key data
        if (privateKeyData.length != 32) {
            throw new IllegalArgumentException("Invalid Solana private key length: " + privateKeyData.length);
        }

        // For Solana, you usually represent the private key with the concatenation of the private and public keys.
        // The public key can be derived using the private key.
        byte[] publicKey = solanaPrivateKey.getPublicKeyEd25519().data();

        // Combine the private key and public key into a 64-byte array
        byte[] solanaKeyPair = new byte[64];
        System.arraycopy(privateKeyData, 0, solanaKeyPair, 0, 32); // Copy private key
        System.arraycopy(publicKey, 0, solanaKeyPair, 32, 32); // Copy public key

        return solanaKeyPair; // Return the combined 64-byte key pair
    }

    public static String solanaPrivateKeyToHex(byte[] solanaKeyPair) {
//        StringBuilder hexString = new StringBuilder();
//        for (byte b : solanaKeyPair) {
//            hexString.append(String.format("%02x", b));
//        }
        return Base58.encodeNoCheck(solanaKeyPair);
    }

    public void writeFile(String PATH) {
        File directory = new File(PATH);
        if (!directory.exists()) {
            directory.mkdir();
            // If you require it to make the entire directory path including parents,
            // use directory.mkdirs(); here instead.
        }
    }

    static String getTokenAccount(String tokenAddress, String walletAddress) {
        SolanaAddress address = new SolanaAddress(walletAddress);
        return address.defaultTokenAddress(tokenAddress);
    }
}
