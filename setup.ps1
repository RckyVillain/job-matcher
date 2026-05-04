# script to automate npm install for Neon Database
Write-Host "Uninstalling AWS/Firebase and installing Neon + NextAuth..."
npm uninstall firebase @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
npm install @neondatabase/serverless next-auth bcryptjs
npm install -D @types/bcryptjs

Write-Host "Dependencies installed!"
Write-Host "Please copy the contents of database.sql and paste it into your Neon SQL Editor."
