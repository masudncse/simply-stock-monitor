import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface AlertErrorProps {
    errors: string[];
}

export default function AlertError({ errors }: AlertErrorProps) {
    if (!errors || errors.length === 0) {
        return null;
    }

    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            </AlertDescription>
        </Alert>
    );
}
