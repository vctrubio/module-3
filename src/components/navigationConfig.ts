export interface NavigationItem {
  id: string;
  name: string;
  description: string;
  iconClass: string; // Using Heroicons classes
  requiresWallet?: boolean;
  requiresContract?: boolean;
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Connection overview and status',
    iconClass: 'fas fa-th-large',
  },
  {
    id: 'wallet',
    name: 'Wallet',
    description: 'View wallet details and provider methods',
    iconClass: 'fas fa-wallet',
    requiresWallet: true,
  },
  {
    id: 'token',
    name: 'Token Inspector',
    description: 'Inspect and interact with ERC-1155 tokens',
    iconClass: 'fas fa-coins',
    requiresWallet: true,
    requiresContract: true,
  },
  {
    id: 'contract',
    name: 'Contract Explorer',
    description: 'Explore contract functions and state',
    iconClass: 'fas fa-file-contract',
    requiresWallet: true,
    requiresContract: true,
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Configure application settings',
    iconClass: 'fas fa-cog',
  }
];
