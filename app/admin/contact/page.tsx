'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { 
  MessageCircle, Search, Filter, Mail, Calendar, 
  MoreHorizontal, RefreshCw, CheckCircle, X, Eye
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  type: string;
  status: string;
  created_at: string;
}

export default function AdminContactPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [searchTerm, statusFilter, submissions]);

  const fetchSubmissions = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setSubmissions(data || []);
      setFilteredSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      toast.error('Failed to load contact submissions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterSubmissions = () => {
    let filtered = [...submissions];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(submission => 
        submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(submission => submission.status === statusFilter);
    }
    
    setFilteredSubmissions(filtered);
    setCurrentPage(1);
  };

  const updateSubmissionStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setSubmissions(submissions.map(submission => 
        submission.id === id ? { ...submission, status } : submission
      ));
      
      toast.success(`Submission marked as ${status}`);
    } catch (error) {
      console.error('Error updating submission status:', error);
      toast.error('Failed to update submission status');
    }
  };

  const viewSubmission = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">New</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'general':
        return <Badge variant="outline">General</Badge>;
      case 'technical':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Technical</Badge>;
      case 'billing':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Billing</Badge>;
      case 'partnership':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Partnership</Badge>;
      case 'feedback':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Feedback</Badge>;
      case 'press':
        return <Badge className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">Press</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubmissions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);

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
            Contact Submissions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and respond to user inquiries
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchSubmissions}
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
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={statusFilter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(null)}
            className={statusFilter === null ? "gradient-primary" : ""}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'new' ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter('new')}
            className={statusFilter === 'new' ? "gradient-primary" : ""}
          >
            New
          </Button>
          <Button
            variant={statusFilter === 'in-progress' ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter('in-progress')}
            className={statusFilter === 'in-progress' ? "gradient-primary" : ""}
          >
            In Progress
          </Button>
          <Button
            variant={statusFilter === 'resolved' ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter('resolved')}
            className={statusFilter === 'resolved' ? "gradient-primary" : ""}
          >
            Resolved
          </Button>
        </div>
      </div>

      {/* Submissions Table */}
      <Card className="glassmorphism border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-purple-600" />
            Contact Submissions
          </CardTitle>
          <CardDescription>
            Total of {filteredSubmissions.length} submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sender</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">
                      <div className="space-y-1">
                        <div>{submission.name}</div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Mail className="w-3 h-3 mr-1" />
                          {submission.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {submission.subject}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(submission.type)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="w-3 h-3 mr-1 text-gray-500" />
                        {format(new Date(submission.created_at), 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(submission.status)}
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
                          <DropdownMenuItem onClick={() => viewSubmission(submission)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateSubmissionStatus(submission.id, 'in-progress')}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Mark In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateSubmissionStatus(submission.id, 'resolved')}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Resolved
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                
                {currentItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <MessageCircle className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-lg font-medium">No submissions found</p>
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
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredSubmissions.length)} of {filteredSubmissions.length}
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

      {/* Submission Detail Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Contact Submission Details</DialogTitle>
            <DialogDescription>
              Submitted on {selectedSubmission && format(new Date(selectedSubmission.created_at), 'MMMM dd, yyyy HH:mm')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h4>
                  <p className="text-gray-900 dark:text-white">{selectedSubmission.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h4>
                  <p className="text-gray-900 dark:text-white">{selectedSubmission.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</h4>
                  <div>{getTypeBadge(selectedSubmission.type)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h4>
                  <div>{getStatusBadge(selectedSubmission.status)}</div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Subject</h4>
                <p className="text-gray-900 dark:text-white">{selectedSubmission.subject}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Message</h4>
                <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                    {selectedSubmission.message}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    updateSubmissionStatus(selectedSubmission.id, 'in-progress');
                    setSelectedSubmission(null);
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Mark In Progress
                </Button>
                <Button
                  onClick={() => {
                    updateSubmissionStatus(selectedSubmission.id, 'resolved');
                    setSelectedSubmission(null);
                  }}
                  className="gradient-primary"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Resolved
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}