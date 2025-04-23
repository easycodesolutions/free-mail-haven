
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createEmailAccount, hasActiveEmail, getCurrentEmail } from "@/lib/mail-api";
import { Mail, Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface EmailGeneratorProps {
  onEmailGenerated: () => void;
}

export function EmailGenerator({ onEmailGenerated }: EmailGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [email, setEmail] = useState<string | null>(getCurrentEmail());
  const { toast } = useToast();

  const generateNewEmail = async () => {
    setIsGenerating(true);
    try {
      const result = await createEmailAccount();
      if (result) {
        setEmail(result.address);
        onEmailGenerated();
        toast({
          title: "Email address created!",
          description: `Your temporary email: ${result.address}`,
          duration: 3000,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to create email",
          description: "There was an error creating your temporary email. Please try again.",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again later.",
        duration: 3000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyEmailToClipboard = () => {
    if (email) {
      navigator.clipboard.writeText(email);
      toast({
        title: "Copied!",
        description: "Email address copied to clipboard",
        duration: 1500,
      });
    }
  };

  return (
    <Card className="w-full shadow-md border-mail-accent bg-white">
      <CardHeader className="bg-mail-primary text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Mail className="h-5 w-5" />
          Temporary Email Address
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {email ? (
          <div className="space-y-4">
            <div className="bg-mail-background p-3 rounded-md border border-mail-accent flex items-center justify-between">
              <span className="font-medium text-gray-800 break-all">{email}</span>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={copyEmailToClipboard} 
                className="hover:bg-mail-hover"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={generateNewEmail}
                disabled={isGenerating}
                className="bg-mail-primary hover:bg-mail-secondary text-white"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Create New Address
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="text-center text-gray-600">
              <p>Generate a temporary email address to protect your privacy and avoid spam in your main inbox.</p>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={generateNewEmail}
                disabled={isGenerating}
                className="bg-mail-primary hover:bg-mail-secondary text-white px-6"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Generate Email Address
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
