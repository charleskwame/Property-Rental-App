"use client";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const runtime = "edge";

export const GoToPageFunction = (route: AppRouterInstance, path: string) => {
	return route.push(path);
};
