# Nestro Health

Nestro Health is a comprehensive health and wellness tracking application built with Next.js. It provides various calculators for health metrics like BMI, body fat percentage, ideal weight, calorie needs, and more.

## Features

- Multiple health calculators
- Profile system for saving and tracking results
- Multi-language support (English and Kurdish)
- PDF export of health reports
- Responsive design for all devices

## Getting Started

First, clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/nestrohealth.git
cd nestrohealth
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technologies Used

- Next.js 13+ (App Router)
- React 18+
- Tailwind CSS
- Framer Motion
- TypeScript
- Supabase (Authentication and Database)

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Supabase Setup

This application uses Supabase for data storage. To set up Supabase:

1. Create a Supabase account and project at [supabase.com](https://supabase.com)
2. Run the SQL migrations found in the `supabase/migrations` folder
3. Add your Supabase URL and anon key to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment on Vercel

The easiest way to deploy this Next.js app is to use Vercel:

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com/new) and import your repository
3. Add the following environment variables in Vercel's project settings:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
   - `NEXT_PUBLIC_GEMINI_API_KEY` (optional) - For AI assistant functionality
4. Deploy!

Vercel will automatically build and deploy your application.

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS, Framer Motion
- **Backend**: Next.js API routes, Supabase
- **Authentication**: Supabase Auth (name-only authentication)
- **AI**: Google's Gemini API
- **PDF Generation**: jsPDF
- **Languages**: TypeScript, JavaScript

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
