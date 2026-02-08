'use client'

interface AvatarProps {
    src?: string | null
    name: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
}

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
    const sizeClasses = {
        sm: 'avatar-sm',
        md: 'avatar-md',
        lg: 'avatar-lg',
        xl: 'avatar-xl',
    }

    // Get initials from name
    const initials = name
        .split(' ')
        .map((word) => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

    if (src) {
        return (
            <div className={`avatar ${sizeClasses[size]} ${className}`}>
                <img src={src} alt={name} />
            </div>
        )
    }

    return (
        <div className={`avatar ${sizeClasses[size]} ${className}`}>
            {initials}
        </div>
    )
}

// Avatar Group
interface AvatarGroupProps {
    avatars: { src?: string | null; name: string }[]
    max?: number
    size?: 'sm' | 'md' | 'lg'
}

export function AvatarGroup({ avatars, max = 3, size = 'md' }: AvatarGroupProps) {
    const visible = avatars.slice(0, max)
    const remaining = avatars.length - max

    return (
        <div className="flex -space-x-2">
            {visible.map((avatar, i) => (
                <Avatar
                    key={i}
                    {...avatar}
                    size={size}
                    className="ring-2 ring-white dark:ring-[var(--card)]"
                />
            ))}
            {remaining > 0 && (
                <div className={`avatar avatar-${size} ring-2 ring-white dark:ring-[var(--card)] bg-[var(--slate-200)] text-[var(--slate-600)]`}>
                    +{remaining}
                </div>
            )}
        </div>
    )
}
