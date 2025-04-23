
import { useState, useCallback } from "react";
import { EmailGenerator } from "@/components/EmailGenerator";
import { EmailInbox } from "@/components/EmailInbox";
import { EmailViewer } from "@/components/EmailViewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Mail, RefreshCw, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hasActiveEmail, deleteEmailAccount } from "@/lib/mail-api";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [hasEmail, setHasEmail] = useState(hasActiveEmail);
  const { toast } = useToast();

  const handleEmailGenerated = useCallback(() => {
    setHasEmail(true);
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const handleSelectEmail = useCallback((emailId: string) => {
    setSelectedEmailId(emailId);
  }, []);

  const handleBackToInbox = useCallback(() => {
    setSelectedEmailId(null);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete this temporary email address? All emails will be lost.")) {
      const success = await deleteEmailAccount();
      if (success) {
        setHasEmail(false);
        setSelectedEmailId(null);
        toast({
          title: "Email deleted",
          description: "Your temporary email address has been deleted successfully",
          duration: 3000,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete the email address",
          duration: 3000,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-mail-primary text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-6 w-6" />
            <h1 className="text-xl font-bold">TempMail Haven</h1>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span className="text-sm hidden sm:inline">Protected & Anonymous</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Free Temporary Email</h1>
          <p className="text-gray-600 mt-1">Generate a disposable email address to protect your privacy</p>
        </div>

        {hasEmail ? (
          <>
            <div className="mb-6">
              <EmailGenerator onEmailGenerated={handleEmailGenerated} />
            </div>

            <div className="grid grid-cols-1 gap-6">
              {selectedEmailId ? (
                <EmailViewer emailId={selectedEmailId} onBack={handleBackToInbox} />
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-medium text-gray-800">Your Messages</h2>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleRefresh}
                        className="flex items-center gap-1"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Refresh</span>
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={handleDeleteAccount}
                        className="flex items-center gap-1"
                      >
                        Delete Email
                      </Button>
                    </div>
                  </div>
                  <EmailInbox onSelectEmail={handleSelectEmail} refreshTrigger={refreshTrigger} />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-2">
              <EmailGenerator onEmailGenerated={handleEmailGenerated} />
              
              <Card className="mt-6 shadow-md border-mail-accent bg-white">
                <CardContent className="p-5">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Why use TempMail?</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="bg-mail-accent rounded-full p-1 mr-2 mt-0.5">
                        <Shield className="h-3 w-3 text-mail-primary" />
                      </div>
                      <span className="text-sm text-gray-600">Protect your real email from spam</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-mail-accent rounded-full p-1 mr-2 mt-0.5">
                        <Shield className="h-3 w-3 text-mail-primary" />
                      </div>
                      <span className="text-sm text-gray-600">Sign up for services without using your personal email</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-mail-accent rounded-full p-1 mr-2 mt-0.5">
                        <Shield className="h-3 w-3 text-mail-primary" />
                      </div>
                      <span className="text-sm text-gray-600">No registration required</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-3">
              <Tabs defaultValue="how-it-works" className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
                  <TabsTrigger value="faq">FAQ</TabsTrigger>
                </TabsList>
                <TabsContent value="how-it-works" className="mt-4">
                  <Card>
                    <CardContent className="p-5 space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-800 mb-2">1. Generate Email</h3>
                        <p className="text-sm text-gray-600">Click "Generate Email Address" to create a new temporary email address.</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 mb-2">2. Use Your Temporary Email</h3>
                        <p className="text-sm text-gray-600">Use this email address when signing up for services or anywhere else.</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 mb-2">3. Receive Messages</h3>
                        <p className="text-sm text-gray-600">All emails sent to your temporary address will appear in your inbox.</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 mb-2">4. Auto-Delete</h3>
                        <p className="text-sm text-gray-600">Your temporary email and all messages will be deleted when you close this session.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="faq" className="mt-4">
                  <Card>
                    <CardContent className="p-5 space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-800 mb-1">How long does this email last?</h3>
                        <p className="text-sm text-gray-600">Your temporary email will last as long as your browser session or until you manually delete it.</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 mb-1">Is this service completely free?</h3>
                        <p className="text-sm text-gray-600">Yes, TempMail Haven is completely free with no hidden charges.</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 mb-1">Can I send emails from this address?</h3>
                        <p className="text-sm text-gray-600">No, this service only allows receiving emails, not sending.</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 mb-1">Is it private?</h3>
                        <p className="text-sm text-gray-600">All data is stored in your browser only. When your session ends, the email and messages are permanently deleted.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-gray-400 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm mb-2">TempMail Haven - Free Temporary Email Service</p>
          <p className="text-xs">
            This service is for legitimate privacy purposes only. 
            Please don't use it for spam or illegal activities.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
