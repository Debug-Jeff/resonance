'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { 
  Users, Search, Filter, Mail, Phone, Calendar, 
  MoreHorizontal, Download, RefreshCw, UserCheck, UserX
} from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  gender: string | null;
  phone: string | null;
  joined_at: string;
  updated_at: string;
  is_admin: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
      setCurrentPage(1);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('joined_at', { ascending: false });
      
      if (error) throw error;
      
      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const toggleAdminStatus = async (userId: string, isCurrentlyAdmin: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !isCurrentlyAdmin })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_admin: !isCurrentlyAdmin } : user
      ));
      setFilteredUsers(filteredUsers.map(user => 
        user.id === userId ? { ...user, is_admin: !isCurrentlyAdmin } : user
      ));
      
      toast.success(`User ${isCurrentlyAdmin ? 'removed from' : 'added to'} admin role`);
    } catch (error) {
      console.error('Error updating admin status:', error);
      toast.error('Failed to update admin status');
    }
  };

  const exportUserData = async (userId: string) => {
    try {
      // Fetch user data
      const [profileResult, moodEntriesResult, voiceSessionsResult, notesResult, settingsResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('mood_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('voice_sessions').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('notes').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('user_settings').select('*').eq('user_id', userId).single()
      ]);
      
      // Prepare export data
      const userData = {
        profile: profileResult.data,
        moodEntries: moodEntriesResult.data || [],
        voiceSessions: voiceSessionsResult.data || [],
        notes: notesResult.data || [],
        settings: settingsResult.data || {},
        exportDate: new Date().toISOString()
      };
      
      // Create downloadable file
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-${userId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('User data exported successfully');
    } catch (error) {
      console.error('Error exporting user data:', error);
      toast.error('Failed to export user data');
    }
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 skeleton"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 skeleton"></div>
        </div>
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg skeleton"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage all users on the platform
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchUsers}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Users Table */}
      <Card className="glassmorphism border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-purple-600" />
            Users
          </CardTitle>
          <CardDescription>
            Total of {filteredUsers.length} users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center overflow-hidden">
                          {user.avatar_url ? (
                            <img 
                              src={user.avatar_url} 
                              alt={user.name || 'User'} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-lg font-semibold text-purple-600">
                              {user.name?.[0] || user.email[0].toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{user.name || 'Unnamed User'}</div>
                          <div className="text-xs text-gray-500">{user.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="w-3 h-3 mr-1 text-gray-500" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center text-sm">
                            <Phone className="w-3 h-3 mr-1 text-gray-500" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.gender ? (
                        <Badge variant="outline">
                          {user.gender}
                        </Badge>
                      ) : (
                        <span className="text-gray-500 text-sm">Not specified</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="w-3 h-3 mr-1 text-gray-500" />
                        {format(new Date(user.joined_at), 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.is_admin ? (
                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          Admin
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          User
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toggleAdminStatus(user.id, user.is_admin)}>
                            {user.is_admin ? (
                              <>
                                <UserX className="w-4 h-4 mr-2" />
                                Remove Admin
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-4 h-4 mr-2" />
                                Make Admin
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => exportUserData(user.id)}>
                            <Download className="w-4 h-4 mr-2" />
                            Export Data
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                
                {currentUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Users className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm">Try adjusting your search criteria</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <Button
                    key={number}
                    variant={currentPage === number ? "default" : "outline"}
                    size="sm"
                    onClick={() => paginate(number)}
                    className={currentPage === number ? "gradient-primary" : ""}
                  >
                    {number}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}