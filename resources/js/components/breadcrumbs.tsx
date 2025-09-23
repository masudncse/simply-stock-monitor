import { Breadcrumbs as MuiBreadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Link } from '@inertiajs/react';
import { Fragment } from 'react';

export function Breadcrumbs({
    breadcrumbs,
}: {
    breadcrumbs: BreadcrumbItemType[];
}) {
    return (
        <>
            {breadcrumbs.length > 0 && (
                <MuiBreadcrumbs>
                    {breadcrumbs.map((item, index) => {
                        const isLast = index === breadcrumbs.length - 1;
                        return (
                            <Fragment key={index}>
                                {isLast ? (
                                    <Typography color="text.primary">
                                        {item.title}
                                    </Typography>
                                ) : (
                                    <MuiLink
                                        component={Link}
                                        href={item.href}
                                        color="inherit"
                                        underline="hover"
                                    >
                                        {item.title}
                                    </MuiLink>
                                )}
                            </Fragment>
                        );
                    })}
                </MuiBreadcrumbs>
            )}
        </>
    );
}
