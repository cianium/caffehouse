#!/bin/bash
# 🚀 اسکریپت ساخت و ارسال خودکار پروژه BODRIN به گیت‌هاب (GitHub)

echo "=========================================================="
echo "☕ BODRIN Specialty Coffee Roastery - GitHub Push Helper"
echo "=========================================================="

read -p "نام کاربری گیت‌هاب شما (GitHub Username): " GITHUB_USER
read -p "نام ریپازیتوری مورد نظر (پیش‌فرض: bodrin-coffee): " REPO_NAME
REPO_NAME=${REPO_NAME:-bodrin-coffee}

read -s -p "توکن دسترسی گیت‌هاب (Personal Access Token با دسترسی repo): " GITHUB_TOKEN
echo ""

if [ -z "$GITHUB_USER" ] || [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ خطا: نام کاربری یا توکن گیت‌هاب وارد نشد."
  exit 1
fi

echo "📦 در حال ایجاد ریپازیتوری در گیت‌هاب..."
CREATE_REPO_RES=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$REPO_NAME\",\"private\":false,\"description\":\"BODRIN Specialty Coffee Roastery Platform\"}")

if [ "$CREATE_REPO_RES" -eq 201 ]; then
  echo "✅ ریپازیتوری $REPO_NAME با موفقیت در گیت‌هاب ایجاد شد."
elif [ "$CREATE_REPO_RES" -eq 422 ]; then
  echo "ℹ️ ریپازیتوری $REPO_NAME از قبل وجود دارد. به مرحله Push می‌رویم..."
else
  echo "⚠️ پاسخ گیت‌هاب (کد وضعیت: $CREATE_REPO_RES). در حال ادامه عملیات..."
fi

echo "🔄 تنظیم Remote و شاخه main..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"
git branch -M main

echo "🚀 در حال ارسال کدها به گیت‌هاب (Push)..."
git push -u origin main

if [ $? -eq 0 ]; then
  echo "=========================================================="
  echo "🎉 تبریک! کدهای پروژه با موفقیت به آدرس زیر منتقل شدند:"
  echo "👉 https://github.com/${GITHUB_USER}/${REPO_NAME}"
  echo "=========================================================="
  # پاک کردن توکن از remote برای امنیت
  git remote set-url origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
else
  echo "❌ در ارسال کدها خطایی رخ داد. لطفا توکن و سطح دسترسی repo را بررسی فرمایید."
fi
