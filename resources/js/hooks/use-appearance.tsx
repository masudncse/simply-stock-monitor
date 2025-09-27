import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

export type PrimaryColor = 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'pink' | 'indigo' | 'teal' | 'cyan' | 'emerald' | 'lime' | 'amber' | 'violet' | 'rose' | 'slate';

const prefersDark = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

// Primary color definitions
const primaryColors: Record<PrimaryColor, { light: string; dark: string }> = {
    blue: { light: '221.2 83.2% 53.3%', dark: '217.2 91.2% 59.8%' },
    green: { light: '142.1 76.2% 36.3%', dark: '142.1 70.6% 45.3%' },
    purple: { light: '262.1 83.3% 57.8%', dark: '263.4 70% 50.4%' },
    red: { light: '0 84.2% 60.2%', dark: '0 72.2% 50.6%' },
    orange: { light: '24.6 95% 53.1%', dark: '20.5 90.2% 48.2%' },
    pink: { light: '330.4 81.2% 60.4%', dark: '330.4 81.2% 60.4%' },
    indigo: { light: '238.7 83.5% 66.7%', dark: '238.7 83.5% 66.7%' },
    teal: { light: '173.4 80.4% 40%', dark: '173.4 80.4% 40%' },
    cyan: { light: '188.7 85.7% 53.3%', dark: '188.7 85.7% 53.3%' },
    emerald: { light: '158.1 64.4% 51.6%', dark: '158.1 64.4% 51.6%' },
    lime: { light: '84.4 81% 44.5%', dark: '84.4 81% 44.5%' },
    amber: { light: '45.4 93.4% 47.2%', dark: '45.4 93.4% 47.2%' },
    violet: { light: '258.3 89.5% 66.3%', dark: '258.3 89.5% 66.3%' },
    rose: { light: '346.8 77.2% 49.8%', dark: '346.8 77.2% 49.8%' },
    slate: { light: '215.4 16.3% 46.9%', dark: '215.4 16.3% 46.9%' },
};

const applyTheme = (appearance: Appearance, primaryColor: PrimaryColor = 'blue') => {
    const isDark =
        appearance === 'dark' || (appearance === 'system' && prefersDark());

    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    
    // Apply primary color
    const color = primaryColors[primaryColor];
    const root = document.documentElement;
    root.style.setProperty('--primary', color[isDark ? 'dark' : 'light']);
};

const mediaQuery = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.matchMedia('(prefers-color-scheme: dark)');
};

const handleSystemThemeChange = () => {
    const currentAppearance = localStorage.getItem('appearance') as Appearance;
    const currentPrimaryColor = localStorage.getItem('primaryColor') as PrimaryColor;
    applyTheme(currentAppearance || 'system', currentPrimaryColor || 'blue');
};

export function initializeTheme() {
    const savedAppearance =
        (localStorage.getItem('appearance') as Appearance) || 'system';
    const savedPrimaryColor =
        (localStorage.getItem('primaryColor') as PrimaryColor) || 'blue';

    applyTheme(savedAppearance, savedPrimaryColor);

    // Add the event listener for system theme changes...
    mediaQuery()?.addEventListener('change', handleSystemThemeChange);
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>('system');
    const [primaryColor, setPrimaryColor] = useState<PrimaryColor>('blue');

    const updateAppearance = useCallback((mode: Appearance) => {
        setAppearance(mode);

        // Store in localStorage for client-side persistence...
        localStorage.setItem('appearance', mode);

        // Store in cookie for SSR...
        setCookie('appearance', mode);

        applyTheme(mode, primaryColor);
    }, [primaryColor]);

    const updatePrimaryColor = useCallback((color: PrimaryColor) => {
        setPrimaryColor(color);

        // Store in localStorage for client-side persistence...
        localStorage.setItem('primaryColor', color);

        // Store in cookie for SSR...
        setCookie('primaryColor', color);

        applyTheme(appearance, color);
    }, [appearance]);

    useEffect(() => {
        const savedAppearance = localStorage.getItem(
            'appearance',
        ) as Appearance | null;
        const savedPrimaryColor = localStorage.getItem(
            'primaryColor',
        ) as PrimaryColor | null;
        
        setAppearance(savedAppearance || 'system');
        setPrimaryColor(savedPrimaryColor || 'blue');
        applyTheme(savedAppearance || 'system', savedPrimaryColor || 'blue');

        return () =>
            mediaQuery()?.removeEventListener(
                'change',
                handleSystemThemeChange,
            );
    }, []);

    return { appearance, updateAppearance, primaryColor, updatePrimaryColor } as const;
}
