import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import prisma from "@/app/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/submitButton";

async function getData(userId: string) {
  const data = prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      colorScheme: true,
    },
  });
  return data;
}

export default async function SettingSpage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.id as string);

  async function postData(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const colorScheme = formData.get("color") as string;

    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        name: name ?? undefined,
        colorScheme: colorScheme ?? undefined,
      },
    });
  }

  return (
    <div className="grid items-start gap-8">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Settings
          </h1>
          <p className="text-lg text-muted-foreground">Profile settings</p>
        </div>
      </div>
      <Card>
        <form action={postData}>
          <CardHeader>
            <CardTitle>General data</CardTitle>
            <CardDescription>
              Please provide informations about yourself
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label>Your name</Label>
                <Input
                  name="name"
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  defaultValue={data?.name ?? undefined}
                />
              </div>
              <div className="space-y-1">
                <Label>Your email</Label>
                <Input
                  name="email"
                  type="email"
                  id="email"
                  placeholder="Your Email"
                  defaultValue={data?.email as string}
                />
              </div>
              <div className="space-y-1">
                <Label>Color scheme</Label>
                <Select name="color" defaultValue={data?.colorScheme}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a color" />
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Color</SelectLabel>
                        <SelectItem value="theme-green">Green</SelectItem>
                        <SelectItem value="theme-blue">Blue</SelectItem>
                        <SelectItem value="theme-violet">Violet</SelectItem>
                        <SelectItem value="theme-rose">Rose</SelectItem>
                        <SelectItem value="theme-orange">Orange</SelectItem>
                        <SelectItem value="theme-yellow">Yellow</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </SelectTrigger>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
