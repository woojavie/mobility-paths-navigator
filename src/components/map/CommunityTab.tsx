import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, MapPin, AlertTriangle } from 'lucide-react';
import type { AccessibilityPoint, AccessibilityIssue } from './types';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CommunityTabProps {
  accessibilityPoints: AccessibilityPoint[];
  accessibilityIssues: AccessibilityIssue[];
  onPointClick: (point: AccessibilityPoint) => void;
  onIssueClick: (issue: AccessibilityIssue) => void;
  onPointsUpdate: () => void;
  onIssuesUpdate: () => void;
}

export function CommunityTab({
  accessibilityPoints,
  accessibilityIssues,
  onPointClick,
  onIssueClick,
  onPointsUpdate,
  onIssuesUpdate
}: CommunityTabProps) {
  const [activeTab, setActiveTab] = useState('points');

  const handleUpvotePoint = async (point: AccessibilityPoint) => {
    try {
      await supabase.from('accessibility_points').update({
        upvotes: (point.upvotes || 0) + 1
      }).eq('id', point.id);
      onPointsUpdate();
      toast({
        title: "Success",
        description: "Point upvoted successfully!"
      });
    } catch (error) {
      console.error('Error upvoting point:', error);
      toast({
        title: "Error",
        description: "Failed to upvote point. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpvoteIssue = async (issue: AccessibilityIssue) => {
    try {
      await supabase.from('accessibility_issues').update({
        upvotes: (issue.upvotes || 0) + 1
      }).eq('id', issue.id);
      onIssuesUpdate();
      toast({
        title: "Success",
        description: "Issue upvoted successfully!"
      });
    } catch (error) {
      console.error('Error upvoting issue:', error);
      toast({
        title: "Error",
        description: "Failed to upvote issue. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Community Contributions</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mb-4">
          <TabsTrigger value="points" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Points
          </TabsTrigger>
          <TabsTrigger value="issues" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Issues
          </TabsTrigger>
        </TabsList>

        <TabsContent value="points" className="flex-1">
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-4">
              {accessibilityPoints.map((point) => (
                <div
                  key={point.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => onPointClick(point)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{point.name}</h3>
                      <p className="text-sm text-gray-500">{point.type.replace(/_/g, ' ')}</p>
                      {point.description && (
                        <p className="text-sm mt-1">{point.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={point.verified ? "default" : "secondary"}>
                          {point.verified ? "Verified" : "Unverified"}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Added {formatDate(point.created_at)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpvotePoint(point);
                      }}
                      className="flex items-center gap-1"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{point.upvotes || 0}</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="issues" className="flex-1">
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-4">
              {accessibilityIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => onIssueClick(issue)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{issue.title}</h3>
                      <p className="text-sm text-gray-500">{issue.type.replace(/_/g, ' ')}</p>
                      {issue.description && (
                        <p className="text-sm mt-1">{issue.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={issue.verified ? "default" : "secondary"}>
                          {issue.verified ? "Verified" : "Unverified"}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Reported {formatDate(issue.created_at)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpvoteIssue(issue);
                      }}
                      className="flex items-center gap-1"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{issue.upvotes || 0}</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
} 