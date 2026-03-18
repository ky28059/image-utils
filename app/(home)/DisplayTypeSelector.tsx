import { forwardRef } from 'react';
import { Select } from 'radix-ui';
import type { SelectItemProps } from '@radix-ui/react-select';

// Icons
import { FaCheck, FaChevronDown, FaChevronUp } from 'react-icons/fa6';


type DisplayTypeSelectorProps = {
    type: 'album' | 'list',
    setType: (type: 'album' | 'list') => void,
}

export default function DisplayTypeSelector(props: DisplayTypeSelectorProps) {
    return (
        <Select.Root value={props.type} onValueChange={props.setType}>
            <Select.Trigger
                className="flex-none flex gap-2 items-center text-sm px-3 py-1 rounded-full bg-black/40 hover:bg-black/20 transition duration-100 cursor-pointer"
                aria-label="Display type"
            >
                <Select.Value placeholder="Select a display…" />
                <Select.Icon className="text-secondary text-xs">
                    <FaChevronDown />
                </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
                <Select.Content className="bg-black rounded">
                    {/*
                    <Select.ScrollUpButton className="SelectScrollButton">
                        <FaChevronUp />
                    </Select.ScrollUpButton>
                    */}
                    <Select.Viewport className="p-1.5">
                        <SelectItem value="album">Albums</SelectItem>
                        <SelectItem value="list">List</SelectItem>
                    </Select.Viewport>
                    {/*
                    <Select.ScrollDownButton className="SelectScrollButton">
                        <FaChevronDown />
                    </Select.ScrollDownButton>
                    */}
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    )
}

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
    ({ children, className, ...props }, forwardedRef) => {
        return (
            <Select.Item
                className="flex items-center pl-6 pr-3 text-sm cursor-pointer data-highlighted:bg-white/10 data-disabled:opacity-50 outline-none"
                {...props}
                ref={forwardedRef}
            >
                <Select.ItemText>{children}</Select.ItemText>
                <Select.ItemIndicator className="absolute left-2">
                    <FaCheck />
                </Select.ItemIndicator>
            </Select.Item>
        );
    },
);
