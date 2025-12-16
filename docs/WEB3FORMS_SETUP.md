# Web3Forms Setup Guide

## 📋 Overview

RefugiosLibresDignos uses **Web3Forms** for the contact form. It's free, unlimited, and requires no backend.

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Your API Key

1. **Visit** [https://web3forms.com/](https://web3forms.com/)
2. **Scroll down** to "Get Started for Free"
3. **Enter your email**: `refugioslibresdignos@gmail.com`
4. **Click** "Create Access Key"
5. **Check your email** for the API key (arrives instantly)
6. **Save the key** - you'll need it in the next step

### Step 2: Configure Your Environment

#### For Local Development:

1. **Create `.env` file** in the project root:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env`** and add your key:
   ```env
   PUBLIC_WEB3FORMS_KEY=your_actual_api_key_here
   ```

3. **Restart the dev server**:
   ```bash
   pnpm dev
   ```

#### For Vercel Production:

1. **Go to** [Vercel Dashboard](https://vercel.com/dashboard)
2. **Select your project**: `refusdignos`
3. **Navigate to**: Settings → Environment Variables
4. **Add new variable**:
   - **Key**: `PUBLIC_WEB3FORMS_KEY`
   - **Value**: Your Web3Forms API key
   - **Environments**: Production, Preview, Development (check all)
5. **Save** and **redeploy** your site

## 📧 Email Configuration

Web3Forms will send form submissions to: `refugioslibresdignos@gmail.com`

### Email Format:
- **From**: Web3Forms <noreply@web3forms.com>
- **Reply-To**: The user's email from the form
- **Subject**: "Nuevo mensaje de contacto - RefugiosLibresDignos"
- **Body**:
  ```
  Name: [User's name]
  Email: [User's email]
  Message: [User's message]
  ```

## 🧪 Testing the Form

### Local Testing:

1. **Start dev server**: `pnpm dev`
2. **Navigate to**: http://localhost:4321/contacto
3. **Fill out the form** with test data
4. **Submit** and verify:
   - ✅ Success message appears
   - ✅ Form resets
   - ✅ Email received at `refugioslibresdignos@gmail.com`

### Production Testing:

1. **Deploy to Vercel**: `git push origin main`
2. **Visit**: https://your-domain.com/contacto
3. **Test submission** with real data
4. **Verify email delivery**

## 🔒 Security Features

### Built-in Protection:
- ✅ **Honeypot field** (`botcheck`) - catches bots
- ✅ **CAPTCHA** (optional) - can enable in Web3Forms dashboard
- ✅ **Rate limiting** - prevents spam
- ✅ **Email validation** - client-side and server-side

### Privacy:
- ✅ **GDPR compliant**
- ✅ **No data storage** - emails sent directly
- ✅ **No tracking** - Web3Forms doesn't track users

## 🎨 Customization Options

You can customize the form in `/src/pages/contacto.astro`:

### Change Email Subject:
```html
<input type="hidden" name="subject" value="Your Custom Subject" />
```

### Add Auto-Reply:
```html
<input type="hidden" name="autoresponse" value="Thank you for contacting us!" />
```

### Redirect After Success:
```html
<input type="hidden" name="redirect" value="https://yourdomain.com/gracias" />
```

### Add CC Recipients:
```html
<input type="hidden" name="ccemail" value="other@email.com" />
```

## 📊 Monitoring Submissions

### Web3Forms Dashboard:
1. **Login** at [https://web3forms.com/dashboard](https://web3forms.com/dashboard)
2. **View** submission logs (last 30 days)
3. **Monitor** spam blocks
4. **Configure** CAPTCHA settings

### Email Monitoring:
- Check `refugioslibresdignos@gmail.com` inbox
- Set up filters/labels for form submissions
- Configure auto-responses if needed

## 🐛 Troubleshooting

### Issue: "Form not submitting"
- ✅ Check API key is set correctly in `.env`
- ✅ Verify dev server restarted after adding `.env`
- ✅ Check browser console for errors
- ✅ Verify network tab shows POST to `web3forms.com`

### Issue: "Not receiving emails"
- ✅ Check spam folder
- ✅ Verify email in Web3Forms dashboard
- ✅ Wait 1-2 minutes (occasional delays)
- ✅ Check Web3Forms account status

### Issue: "Invalid Access Key error"
- ✅ Verify key is copied correctly (no spaces)
- ✅ Check `.env` file has `PUBLIC_` prefix
- ✅ Confirm environment variable in Vercel
- ✅ Redeploy after adding Vercel env var

### Issue: "Too many requests"
- ✅ Web3Forms has rate limits
- ✅ Wait a few minutes and try again
- ✅ Enable CAPTCHA to prevent abuse

## 📚 Additional Resources

- **Web3Forms Docs**: https://docs.web3forms.com/
- **Support**: https://web3forms.com/support
- **Status Page**: https://status.web3forms.com/

## 🔄 Migration from Formspree

If you need to switch back to Formspree:

1. Update form action in `contacto.astro`:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID">
   ```

2. Change honeypot field:
   ```html
   <input type="text" name="_gotcha" style="display:none" />
   ```

3. Remove Web3Forms hidden fields

---

**Last Updated**: 2025-12-16
**Maintained By**: Development Team
