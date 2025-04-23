
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Inbox, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getMessages } from "@/lib/mail-api";
import { formatDistanceToNow } from "date-fns";

interface Email {
  id: string;
  from: string;
  subject: string;
  intro: string;
  createdAt: string;
}

interface EmailInboxProps {
  onSelectEmail: (emailId: string) => void;
  refreshTrigger: number;
}

export function EmailInbox({ onSelectEmail, refreshTrigger }: EmailInboxProps) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEmails = async () => {
    try {
      const messages = await getMessages();
      setEmails(messages);
    } catch (error) {
      console.error("Failed to fetch emails:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEmails();
    
    // Set up polling every 15 seconds
    const interval = setInterval(() => {
      fetchEmails();
    }, 15000);
    
    return () => clearInterval(interval);
  }, [refreshTrigger]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchEmails();
  };

  return (
    <Card className="w-full shadow-md border-mail-accent bg-white">
      <CardHeader className="bg-mail-primary text-white rounded-t-lg flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Inbox className="h-5 w-5" />
          Inbox
        </CardTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-mail-secondary"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-4 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : emails.length > 0 ? (
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {emails.map((email) => (
              <div 
                key={email.id}
                className="p-4 hover:bg-mail-hover cursor-pointer transition-colors"
                onClick={() => onSelectEmail(email.id)}
              >
                <div className="font-medium text-gray-800 mb-1 line-clamp-1">{email.subject || '(No Subject)'}</div>
                <div className="text-sm text-gray-500 mb-2">From: {email.from}</div>
                <div className="text-sm text-gray-600 line-clamp-2">{email.intro || '(No content)'}</div>
                <div className="flex items-center mt-2 text-xs text-gray-400">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDistanceToNow(new Date(email.createdAt), { addSuffix: true })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 px-4 text-center text-gray-500">
            <Inbox className="mx-auto h-8 w-8 mb-2 opacity-40" />
            <p>No emails yet</p>
            <p className="text-sm mt-1">Waiting for new messages to arrive</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
