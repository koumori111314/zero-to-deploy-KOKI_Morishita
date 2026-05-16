import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ログイン / 登録</CardTitle>
          <CardDescription>サンプルのUIコンポーネントです</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">メールアドレス</label>
            <Input id="email" type="email" placeholder="test@example.com" />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">パスワード</label>
            <Input id="password" type="password" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">キャンセル</Button>
          <Button>ログイン</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
