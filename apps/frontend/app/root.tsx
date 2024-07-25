import * as React from 'react';
import { PropsWithChildren } from 'react';
import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useRouteError,
} from '@remix-run/react';
import { MuiDocument } from '~/lib/mui/MuiDocument';
import { getMuiLinks } from '~/lib/mui/getMuiLinks';
import { LinksFunction } from '@remix-run/node';
import { MuiMeta } from '~/lib/mui/MuiMeta';
import tailwindStyleSheetUrl from './tailwind.css?url';

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: tailwindStyleSheetUrl },
    ...getMuiLinks(),
];

export function Layout({ children }: PropsWithChildren) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <Meta />
                <MuiMeta />
                <Links />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return (
        <MuiDocument>
            <Outlet />
        </MuiDocument>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        let message;
        switch (error.status) {
            case 401:
                message = (
                    <p>
                        Oops! Looks like you tried to visit a page that you do not have access to.
                    </p>
                );
                break;
            case 404:
                message = <p>Oops! Looks like you tried to visit a page that does not exist.</p>;
                break;

            default:
                throw new Error(error.data || error.statusText);
        }

        return (
            <MuiDocument>
                <h1>
                    {error.status}: {error.statusText}
                </h1>
                {message}
            </MuiDocument>
        );
    }

    if (error instanceof Error) {
        console.error(error);
        return (
            <MuiDocument>
                <div>
                    <h1>There was an error</h1>
                    <p>{error.message}</p>
                    <hr />
                    <p>
                        Hey, developer, you should replace this with what you want your users to
                        see.
                    </p>
                </div>
            </MuiDocument>
        );
    }

    return <h1>Unknown Error</h1>;
}
