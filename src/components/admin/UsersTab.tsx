import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '@/types';
import { UserFiltersSection } from './UserFiltersSection';
import { UserListTable } from './UserListTable';

interface UsersTabProps {
  users: UserProfile[];
  onEdit: (user: UserProfile) => void;
  onToggleBlock?: (user: UserProfile) => void;
}

export function UsersTab({ users, onEdit, onToggleBlock }: UsersTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !searchQuery || 
        user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesTier = tierFilter === 'all' || (user.tier || 'basic') === tierFilter;
      
      let matchesDate = true;
      if (dateRange !== 'all' && user.createdAt) {
        const createdDate = new Date(user.createdAt);
        const now = new Date();
        const diffDays = (now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24);
        
        if (dateRange === '7d') matchesDate = diffDays <= 7;
        else if (dateRange === '30d') matchesDate = diffDays <= 30;
        else if (dateRange === '90d') matchesDate = diffDays <= 90;
      }
      
      return matchesSearch && matchesRole && matchesTier && matchesDate;
    });
  }, [users, searchQuery, roleFilter, tierFilter, dateRange]);

  const activeFiltersCount = [
    roleFilter !== 'all',
    tierFilter !== 'all',
    dateRange !== 'all'
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setTierFilter('all');
    setDateRange('all');
  };

  return (
    <motion.div 
      key="users"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <UserFiltersSection 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        tierFilter={tierFilter}
        setTierFilter={setTierFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        activeFiltersCount={activeFiltersCount}
        clearFilters={clearFilters}
      />

      <UserListTable 
        filteredUsers={filteredUsers}
        onEdit={onEdit}
        onToggleBlock={onToggleBlock}
        activeFiltersCount={activeFiltersCount}
        clearFilters={clearFilters}
      />
    </motion.div>
  );
}
