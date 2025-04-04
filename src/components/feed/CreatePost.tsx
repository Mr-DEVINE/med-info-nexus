
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, Link2Icon, FileText } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";

interface CreatePostProps {
  onPostCreated?: () => void;
}

const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { role, username } = useUser();
  const { toast } = useToast();
  
  // Only specific roles can create posts
  const canCreatePosts = ["doctor", "researcher", "bloodbank", "pharmaceutical"].includes(role as string);
  
  if (!canCreatePosts) {
    return null;
  }

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Empty post",
        description: "Please write something before posting.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Post created",
        description: "Your post has been published successfully!",
      });
      setContent("");
      setIsSubmitting(false);
      if (onPostCreated) {
        onPostCreated();
      }
    }, 1000);
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <Textarea
          placeholder={`Share your research or findings as ${role}...`}
          className="resize-none min-h-24 focus-visible:ring-medicare-blue"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </CardContent>
      <CardFooter className="border-t flex justify-between pt-3">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-gray-600">
            <ImageIcon size={18} className="mr-1" />
            <span>Image</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600">
            <Link2Icon size={18} className="mr-1" />
            <span>Link</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600">
            <FileText size={18} className="mr-1" />
            <span>Document</span>
          </Button>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || !content.trim()}
          className="bg-medicare-blue hover:bg-medicare-dark"
        >
          {isSubmitting ? "Posting..." : "Post"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreatePost;
