import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HomeIcon } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
            <div className="text-center space-y-5">
                <h1 className="text-9xl font-bold text-primary">404</h1>

                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Page not found
                    </h2>
                    <p className="text-muted-foreground">
                        Sorry, we couldn't find the page you're looking for.
                    </p>
                </div>

                <Link href="/">
                    <Button className="mt-4">
                        <HomeIcon className="mr-2 h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}
