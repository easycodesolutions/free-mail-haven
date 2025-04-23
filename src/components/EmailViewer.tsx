
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Clock, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { getMessage } from "@/lib/mail-api";

interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  createdAt: string;
  bodyHtml: string;
  bodyText: string;
  hasAttachments: boolean;
}

interface EmailViewerProps {
  emailId: string | null;
  onBack: () => void;
}

export function EmailViewer({ emailId, onBack }: EmailViewerProps) {
  const [email, setEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (emailId) {
      setLoading(true);
      const fetchEmail = async () => {
        try {
          const emailData = await getMessage(emailId);
          setEmail(emailData);
        } catch (error) {
          console.error("Failed to fetch email:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchEmail();
    }
  }, [emailId]);

  if (!emailId) {
    return null;
  }

  return (
    <Card className="w-full shadow-md border-mail-accent bg-white">
      <CardHeader className="bg-mail-primary text-white rounded-t-lg">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-mail-secondary w-fit mb-2 -ml-2 flex items-center"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Inbox
        </Button>
        <CardTitle className="text-xl">
          {loading ? (
            <Skeleton className="h-7 w-3/4 bg-white/20" />
          ) : (
            email?.subject || '(No Subject)'
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
            <Separator className="my-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : email ? (
          <div>
            <div className="flex justify-between mb-1">
              <div className="font-medium">From:</div>
              <div className="text-gray-600">{email.from}</div>
            </div>
            <div className="flex justify-between mb-1">
              <div className="font-medium">To:</div>
              <div className="text-gray-600">{email.to}</div>
            </div>
            <div className="flex justify-between mb-4">
              <div className="font-medium">Time:</div>
              <div className="text-gray-600 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatDistanceToNow(new Date(email.createdAt), { addSuffix: true })}
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {email.hasAttachments && (
              <div className="mb-4 p-2 bg-mail-background rounded flex items-center text-sm text-gray-600">
                <Paperclip className="h-4 w-4 mr-2 text-mail-primary" />
                This email has attachments (not supported in temporary email)
              </div>
            )}
            
            {email.bodyHtml ? (
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: email.bodyHtml }}
              />
            ) : email.bodyText ? (
              <pre className="whitespace-pre-wrap text-gray-800 font-sans">{email.bodyText}</pre>
            ) : (
              <div className="text-gray-500 italic">(This email has no content)</div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            Failed to load email content
          </div>
        )}
      </CardContent>
      {!loading && email && (
        <CardFooter className="bg-gray-50 p-3 text-xs text-gray-500 rounded-b-lg">
          Temporary email - This message will be automatically deleted when your session expires
        </CardFooter>
      )}
    </Card>
  );
}
