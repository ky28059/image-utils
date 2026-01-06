import type { ReactNode } from 'react'
import type { TooltipContentProps } from '@radix-ui/react-tooltip';
import { Tooltip } from 'radix-ui';


type TooltipWrapperProps = {
    children: ReactNode,
    tooltip: ReactNode,
    side?: TooltipContentProps['side']
}
export default function TooltipWrapper(props: TooltipWrapperProps) {
    return (
        <Tooltip.Root>
            <Tooltip.Trigger asChild>
                {props.children}
            </Tooltip.Trigger>
            <Tooltip.Content
                className="bg-black px-2.5 py-1.5 rounded text-sm"
                side={props.side}
                sideOffset={5}
            >
                {props.tooltip}
                <Tooltip.Arrow className="fill-black" />
            </Tooltip.Content>
        </Tooltip.Root>
    )
}
