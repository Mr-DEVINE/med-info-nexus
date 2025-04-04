
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, MessageSquare, Share2, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostCardProps {
  id: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  date: string;
  title: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
}

const PostCard = ({
  id,
  author,
  date,
  title,
  content,
  image,
  likes,
  comments,
}: PostCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [saved, setSaved] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-medicare-blue text-white flex items-center justify-center font-medium">
            {author.avatar ? (
              <img src={author.avatar} alt={author.name} className="h-full w-full rounded-full object-cover" />
            ) : (
              author.name.charAt(0)
            )}
          </div>
          <div>
            <CardTitle className="text-base font-semibold">{author.name}</CardTitle>
            <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="text-xs px-2 py-0.5 bg-medicare-light text-medicare-blue rounded-full">
                {author.role}
              </span>
              <span className="text-xs">{date}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{content}</p>
        {image && (
          <div className="mb-4 rounded-md overflow-hidden">
            <img src={image} alt={title} className="w-full h-auto" />
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-3 flex justify-between">
        <div className="flex gap-4">
          <Button
            onClick={handleLike}
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center gap-1 text-gray-600",
              liked && "text-medicare-blue"
            )}
          >
            <ThumbsUp size={16} className={liked ? "fill-medicare-blue" : ""} />
            <span>{likeCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-gray-600"
          >
            <MessageSquare size={16} />
            <span>{comments}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-gray-600"
          >
            <Share2 size={16} />
            <span>Share</span>
          </Button>
        </div>
        <Button
          onClick={handleSave}
          variant="ghost"
          size="sm"
          className={cn(
            "text-gray-600",
            saved && "text-medicare-teal"
          )}
        >
          <Bookmark size={16} className={saved ? "fill-medicare-teal" : ""} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
