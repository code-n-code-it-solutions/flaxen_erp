import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap" />
            </Head>
            <body className="flex flex-col min-h-screen">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
