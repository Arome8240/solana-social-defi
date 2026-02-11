# Custodial Wallet System

## Overview

The authentication system now automatically creates and manages Solana wallets for users. This provides a Web2-like experience where users don't need to install wallet extensions or manage seed phrases.

## How It Works

### 1. User Signup

When a user signs up with email and password:

1. A new Solana keypair is generated
2. The private key is encrypted using AES-256-GCM
3. The encrypted private key is stored in the database
4. The public key (wallet address) is stored in plain text
5. User receives their wallet address immediately

### 2. Wallet Encryption

- **Algorithm**: AES-256-GCM (Galois/Counter Mode)
- **Key Derivation**: Scrypt with salt
- **Encryption Key**: Stored in environment variable `WALLET_ENCRYPTION_KEY`
- **Security**: Each encrypted key includes a unique IV and authentication tag

### 3. Wallet Usage

The backend automatically uses the user's wallet for all blockchain operations:

- Minting tokens/NFTs
- Transferring assets
- Signing transactions
- Receiving rewards

## API Changes

### Removed Endpoints

- `POST /api/auth/wallet-connect` - No longer needed

### New Endpoints

#### 1. Sign Up (Modified)

```bash
POST /api/auth/signup
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

Response includes auto-generated wallet:

```json
{
  "message": "User created successfully",
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "walletAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    "biometricEnabled": false
  }
}
```

#### 2. Get Wallet Info

```bash
GET /api/auth/wallet
Authorization: Bearer <token>
```

Response:

```json
{
  "walletAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "balances": {
    "skr": 125.5,
    "sol": 0.5
  }
}
```

#### 3. Export Private Key

```bash
POST /api/auth/export-private-key
Authorization: Bearer <token>
{
  "password": "user-password"
}
```

Response:

```json
{
  "message": "Private key exported successfully",
  "privateKey": "base58-encoded-private-key",
  "warning": "Keep this private key secure. Never share it with anyone."
}
```

## Security Considerations

### Strengths

1. **User-Friendly**: No wallet installation required
2. **Seamless UX**: Instant wallet creation
3. **Encrypted Storage**: Private keys never stored in plain text
4. **Password Protection**: Private key export requires password verification

### Risks

1. **Custodial Nature**: Backend has access to user funds
2. **Single Point of Failure**: If encryption key is compromised, all wallets are at risk
3. **Database Security**: Encrypted keys stored in database

### Best Practices

#### For Development

```env
WALLET_ENCRYPTION_KEY=dev-key-not-for-production
```

#### For Production

1. **Generate Strong Key**:

```bash
openssl rand -base64 32
```

2. **Use Secrets Manager**:
   - AWS Secrets Manager
   - Google Cloud Secret Manager
   - HashiCorp Vault
   - Azure Key Vault

3. **Key Rotation**:
   - Implement key rotation strategy
   - Re-encrypt all private keys with new key
   - Keep old key for decryption during transition

4. **Access Control**:
   - Limit who can access encryption key
   - Use IAM roles and policies
   - Enable audit logging

5. **Backup Strategy**:
   - Encrypted backups of database
   - Secure backup of encryption key
   - Test restore procedures regularly

## Database Schema

### User Model

```typescript
{
  walletAddress: string; // Public key (Solana address)
  encryptedPrivateKey: string; // AES-256-GCM encrypted private key
  username: string;
  email: string;
  passwordHash: string; // Bcrypt hashed password
  biometricEnabled: boolean;
  role: "user" | "creator" | "admin";
  balances: {
    skr: number;
    sol: number;
  }
}
```

## Migration from External Wallets

If you want to support both custodial and external wallets:

1. Make `encryptedPrivateKey` optional in User model
2. Add `walletType: 'custodial' | 'external'` field
3. Check wallet type before operations
4. For external wallets, require user signature
5. For custodial wallets, use stored private key

## Compliance & Legal

### Considerations

1. **Regulatory**: May require money transmitter license in some jurisdictions
2. **Terms of Service**: Clearly state custodial nature
3. **User Agreement**: Users must agree to terms
4. **Insurance**: Consider crypto insurance for custodial funds
5. **Audit**: Regular security audits recommended

### Disclosure

Always inform users that:

- You control their private keys
- They can export their private key anytime
- They should backup their private key
- You're not responsible for lost passwords

## Alternative: Hybrid Approach

For maximum flexibility, support both:

### Custodial Wallet (Default)

- Auto-created on signup
- Managed by backend
- Easy for beginners

### External Wallet (Optional)

- User can link Phantom/Solflare
- User controls private keys
- For advanced users

## Monitoring

Track these metrics:

- Number of custodial wallets created
- Private key export requests
- Failed decryption attempts
- Wallet balance changes
- Suspicious transaction patterns

## Disaster Recovery

### If Encryption Key is Lost

- All custodial wallets become inaccessible
- Users who exported private keys can recover
- Emphasize importance of private key export

### If Database is Compromised

- Encrypted keys are still protected
- Rotate encryption key immediately
- Notify affected users
- Implement additional security measures

## Future Enhancements

1. **Multi-Signature**: Require multiple keys for large transactions
2. **Hardware Security Module (HSM)**: Store encryption key in HSM
3. **Threshold Cryptography**: Split key across multiple servers
4. **Social Recovery**: Allow trusted contacts to help recover wallet
5. **Spending Limits**: Set daily/weekly transaction limits
6. **2FA for Transactions**: Require 2FA for withdrawals
7. **Withdrawal Whitelist**: Only allow transfers to approved addresses

## Code Examples

### Creating a Wallet

```typescript
const wallet = walletService.generateWallet();
const encryptedPrivateKey = walletService.encryptPrivateKey(wallet.privateKey);
```

### Using a Wallet

```typescript
const user = await User.findById(userId).select("+encryptedPrivateKey");
const keypair = walletService.getKeypairFromEncrypted(user.encryptedPrivateKey);
// Use keypair for transactions
```

### Exporting Private Key

```typescript
const privateKey = walletService.exportPrivateKey(user.encryptedPrivateKey);
// Returns base58-encoded private key
```

## Testing

### Test Wallet Creation

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Wallet Info

```bash
curl http://localhost:3000/api/auth/wallet \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Private Key Export

```bash
curl -X POST http://localhost:3000/api/auth/export-private-key \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "password": "password123"
  }'
```

## Support

### User Questions

**Q: Where is my private key?**
A: Your private key is securely encrypted and stored on our servers. You can export it anytime from your account settings.

**Q: Can I use my own wallet?**
A: Currently, we create and manage wallets for you. You can export your private key and import it into any Solana wallet.

**Q: What if I forget my password?**
A: You'll need to reset your password. Make sure to export and backup your private key before resetting.

**Q: Is my wallet safe?**
A: Yes, your private key is encrypted with industry-standard AES-256-GCM encryption. However, we recommend exporting and backing up your private key.

## Conclusion

Custodial wallets provide the best user experience for mainstream adoption but come with security responsibilities. Implement proper security measures, be transparent with users, and consider offering private key export for user sovereignty.
