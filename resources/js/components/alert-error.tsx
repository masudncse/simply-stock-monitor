import { Alert, AlertTitle, List, ListItem, ListItemText } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

export default function AlertError({
    errors,
    title,
}: {
    errors: string[];
    title?: string;
}) {
    return (
        <Alert severity="error" icon={<ErrorIcon />}>
            <AlertTitle>{title || 'Something went wrong.'}</AlertTitle>
            <List dense>
                {Array.from(new Set(errors)).map((error, index) => (
                    <ListItem key={index} sx={{ py: 0 }}>
                        <ListItemText primary={error} />
                    </ListItem>
                ))}
            </List>
        </Alert>
    );
}
