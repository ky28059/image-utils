'use client'

import { useState, ButtonHTMLAttributes, FocusEvent, MouseEvent } from 'react';
import type { TooltipContentProps } from '@radix-ui/react-tooltip';
import AnimatedTooltip from '@/components/AnimatedTooltip';
import { GoShareAndroid } from 'react-icons/go';


type CopyLinkButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
    url?: string,
    tooltip: string,
    side?: TooltipContentProps['side'] // TODO: include all tooltip props?
}

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(' ');
}

export default function CopyLinkButton({
    url,
    tooltip,
    className,
    onClick,
    onFocus,
    onBlur,
    onMouseEnter,
    onMouseLeave,
    ...props
}: CopyLinkButtonProps) {
    const [copied, setCopied] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);

    async function handleClick(event: MouseEvent<HTMLButtonElement>) {
        onClick?.(event);

        if (event.defaultPrevented) return;

        const link = url ?? window.location.href;

        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTooltipOpen(true);
    }

    function closeTooltip() {
        setTooltipOpen(false);
        setCopied(false);
    }

    return (
        <AnimatedTooltip
            tooltip={copied ? 'Link copied!' : tooltip}
            side={props.side}
            open={tooltipOpen}
            onOpenChange={(open) => {
                if (open) setTooltipOpen(true);
            }}
        >
            <button
                type="button"
                aria-label="Copy link"
                className={cx(
                    'cursor-pointer text-primary hover:text-white p-2 rounded-full hover:bg-white/10 transition duration-100',
                    className
                )}
                onClick={handleClick}
                onFocus={(event: FocusEvent<HTMLButtonElement>) => {
                    setTooltipOpen(true);
                    onFocus?.(event);
                }}
                onBlur={(event: FocusEvent<HTMLButtonElement>) => {
                    closeTooltip();
                    onBlur?.(event);
                }}
                onMouseEnter={(event) => {
                    setTooltipOpen(true);
                    onMouseEnter?.(event);
                }}
                onMouseLeave={(event) => {
                    closeTooltip();
                    onMouseLeave?.(event);
                }}
                {...props}
            >
                <GoShareAndroid />
            </button>
        </AnimatedTooltip>
    );
}
