import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
type Friendship = Tables<"friendships">;

export function AddFriendDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: existingFriendships } = useQuery({
    queryKey: ["friendships"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("friendships")
        .select("*")
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`);

      if (error) throw error;
      return data as Friendship[];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !user) return;

    setIsLoading(true);
    try {
      // First, get the user ID for the email from the profiles table
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .eq("email", email)
        .maybeSingle();

      if (userError) {
        throw new Error(t("userNotFound", "common"));
      }

      if (!userData) {
        throw new Error(t("userNotFound", "common"));
      }

      // Check if friendship already exists
      const isFriendshipExists = existingFriendships?.some(
        (friendship) =>
          (friendship.sender_id === user.id && friendship.receiver_id === userData.id) ||
          (friendship.sender_id === userData.id && friendship.receiver_id === user.id)
      );

      if (isFriendshipExists) {
        throw new Error(t("friendshipAlreadyExists", "common"));
      }

      // Create friendship request
      const { error: friendshipError } = await supabase
        .from("friendships")
        .insert({
          sender_id: user.id,
          receiver_id: userData.id,
        });

      if (friendshipError) throw friendshipError;

      toast({
        title: t("success", "common"),
        description: t("friendRequestSent", "common"),
      });

      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: t("error", "common"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("addFriend", "common")}</DialogTitle>
          <DialogDescription>
            {t("addFriendDescription", "common")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder={t("enterFriendEmail", "common")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("cancel", "common")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t("sending", "common") : t("sendRequest", "common")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}