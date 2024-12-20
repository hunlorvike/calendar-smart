# Next.js Project Documentation

## Getting Started

Follow these steps to set up and run the project:

### 1. Start the Development Environment

Run the following commands:

```bash
# Start the development server using Docker
$ docker compose up -d

# Access the MySQL container and grant permissions
$ docker exec -it calendar_smart_db_8 mysql -u root -p
mysql> GRANT ALL PRIVILEGES ON *.* TO 'user'@'%' WITH GRANT OPTION;
```

### 2. Install Dependencies

Using `yarn`, install the required dependencies:

```bash
$ yarn install
```

### 3. Apply Prisma Migrations

Deploy database migrations and generate Prisma client:

```bash
$ npx prisma migrate deploy
$ npx prisma generate
```

### 4. Start the Development Server

Run the development server with:

```bash
$ yarn dev
```

Now, open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see your application in action.

---

## Editing Your Application

To start editing, modify the file located at `app/page.tsx`. The application supports **hot reloading**, so any changes will be reflected immediately.

---

## Optimizations

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to optimize and load the [Geist](https://vercel.com/font) font, ensuring fast and modern typography.

---

## Learning Resources

Explore the following resources to learn more about Next.js:

- 📚 [Next.js Documentation](https://nextjs.org/docs): Learn about Next.js features and API.
- 🏫 [Learn Next.js](https://nextjs.org/learn): An interactive tutorial for beginners.
- 🔗 [Next.js GitHub Repository](https://github.com/vercel/next.js): Contribute and share feedback with the community.

---

## Deployment

The easiest way to deploy your Next.js app is through [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme). Follow the [deployment guide](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

### **Happy Coding!** 🚀
