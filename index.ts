/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { EquicordDevs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

const settings = definePluginSettings({
    platform: {
        type: OptionType.SELECT,
        description: "What platform to pretend you're on.",
        restartNeeded: true,
        options: [
            { label: "Android", value: "android", default: true },
            { label: "iOS", value: "ios" },
            { label: "Desktop", value: "desktop" },
            { label: "Web", value: "web" },
            { label: "Xbox", value: "xbox" },
            { label: "PlayStation", value: "playstation" },
            { label: "VR", value: "vr" }
        ]
    }
});

const PLATFORMS = {
    android: { browser: "Discord Android" },
    ios: { browser: "Discord iOS" },
    desktop: { browser: "Discord Client" },
    web: { browser: "Discord Web" },
    xbox: { browser: "Discord Embedded" },
    playstation: { browser: "Discord Embedded" },
    vr: { os: "android", browser: "Discord VR", device: "Discord VR" }
} as const;

export default definePlugin({
    name: "PlatformSpoofer",
    description: "Spoof what platform or device you're on",
    authors: [EquicordDevs.Drag, EquicordDevs.neoarz],
    settings,
    patches: [
        {
            find: "_doIdentify(){",
            group: true,
            replacement: [
                {
                    match: /window\._ws=null,null!=(\i)/,
                    replace: "window._ws=null,($1?.ws.close(1000),false)"
                },
                {
                    match: /(?<=properties:)\i(?=,)/,
                    replace: "{...$&,...$self.getProperties()}"
                }
            ]
        }
    ],
    getProperties() {
        return PLATFORMS[settings.store.platform];
    }
});
