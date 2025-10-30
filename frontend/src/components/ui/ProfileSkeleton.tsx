import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { cn } from "../../utils";

interface ProfileSkeletonProps {
    className?: string;
}

export function ProfileSkeleton({ className }: ProfileSkeletonProps) {
    return (
        <div className={cn("space-y-6", className)}>
            <div className="h-10 bg-muted rounded-md w-1/3 animate-pulse"></div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        <div className="h-6 bg-muted rounded-md w-1/4 animate-pulse"></div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 max-w-lg">
                        <div>
                            <div className="h-4 bg-muted rounded-md w-1/5 mb-2 animate-pulse"></div>
                            <div className="h-10 bg-muted rounded-md animate-pulse"></div>
                        </div>
                        <div>
                            <div className="h-4 bg-muted rounded-md w-1/5 mb-2 animate-pulse"></div>
                            <div className="h-10 bg-muted rounded-md animate-pulse"></div>
                        </div>
                        <div>
                            <div className="h-4 bg-muted rounded-md w-1/5 mb-2 animate-pulse"></div>
                            <div className="h-10 bg-muted rounded-md animate-pulse"></div>
                        </div>
                        <div className="h-10 bg-muted rounded-md w-1/4 animate-pulse"></div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>
                        <div className="h-6 bg-muted rounded-md w-1/4 animate-pulse"></div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 max-w-lg">
                        <div>
                            <div className="h-4 bg-muted rounded-md w-1/5 mb-2 animate-pulse"></div>
                            <div className="h-10 bg-muted rounded-md animate-pulse"></div>
                        </div>
                        <div>
                            <div className="h-4 bg-muted rounded-md w-1/5 mb-2 animate-pulse"></div>
                            <div className="h-10 bg-muted rounded-md animate-pulse"></div>
                        </div>
                        <div>
                            <div className="h-4 bg-muted rounded-md w-1/5 mb-2 animate-pulse"></div>
                            <div className="h-10 bg-muted rounded-md animate-pulse"></div>
                        </div>
                        <div className="h-10 bg-muted rounded-md w-1/4 animate-pulse"></div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
