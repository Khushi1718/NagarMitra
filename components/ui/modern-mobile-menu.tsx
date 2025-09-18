'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Users, ScanLine, History, Settings } from 'lucide-react';

type IconComponentType = React.ElementType<{ className?: string }>;
export interface InteractiveMenuItem {
  label: string;
  icon: IconComponentType;
  href?: string;
}

export interface InteractiveMenuProps {
  items?: InteractiveMenuItem[];
  accentColor?: string;
}

const defaultItems: InteractiveMenuItem[] = [
    { label: 'home', icon: Home, href: '/' },
    { label: 'community', icon: Users, href: '/community' },
    { label: 'raise issue', icon: ScanLine, href: '/raise-issue' },
    { label: 'history', icon: History, href: '/history' },
    { label: 'settings', icon: Settings, href: '/settings' },
];

const defaultAccentColor = 'var(--component-active-color-default)';

const InteractiveMenu: React.FC<InteractiveMenuProps> = ({ items, accentColor }) => {
  const router = useRouter();
  const pathname = usePathname();

  const finalItems = useMemo(() => {
     if (!items) {
        // No items provided, use defaults silently
        return defaultItems;
     }
     const isValid = Array.isArray(items) && items.length >= 2 && items.length <= 5;
     if (!isValid) {
        console.warn("InteractiveMenu: 'items' prop is invalid. Using default items.", items);
        return defaultItems;
     }
     return items;
  }, [items]);

  const [activeIndex, setActiveIndex] = useState(() => {
    const currentIndex = finalItems.findIndex(item => item.href === pathname);
    return currentIndex >= 0 ? currentIndex : 0;
  });

  useEffect(() => {
      if (activeIndex >= finalItems.length) {
          setActiveIndex(0);
      }
  }, [finalItems, activeIndex]);

  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleItemClick = (index: number) => {
    setActiveIndex(index);
    const item = finalItems[index];
    if (item.href) {
      router.push(item.href);
    }
  };

  // Update active index when pathname changes
  useEffect(() => {
    const currentIndex = finalItems.findIndex(item => item.href === pathname);
    if (currentIndex >= 0) {
      setActiveIndex(currentIndex);
    }
  }, [pathname, finalItems]);

  const navStyle = useMemo(() => {
      const activeColor = accentColor || defaultAccentColor;
      return { '--component-active-color': activeColor } as React.CSSProperties;
  }, [accentColor]); 

  return (
    <nav
      className="menu"
      role="navigation"
      style={navStyle}
    >
      {finalItems.map((item, index) => {
        const isActive = index === activeIndex;
        const isTextActive = isActive;


        const IconComponent = item.icon;

        return (
          <button
            key={item.label}
            className={`menu__item ${isActive ? 'active' : ''}`}
            onClick={() => handleItemClick(index)}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
          >
            <div className="menu__icon">
              <IconComponent className="icon" />
            </div>
            <strong
              className={`menu__text ${isTextActive ? 'active' : ''}`}
            >
              {item.label}
            </strong>
          </button>
        );
      })}
    </nav>
  );
};

export {InteractiveMenu}