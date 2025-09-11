"use client";
import React from "react";
import ThemeToggle from "../../../_components/ThemeToggle";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "../../../../components/ui/dropdown-menu";
import { useAiModel } from "../../../../context/aiModelContext";

const AIModelsOption = [
    { id: 1, name: "gemini-1.5-flash", desc: "Free-tier Gemini model (Google)", provider: "gemini" },
    { id: 2, name: "gemini-2.0-flash", desc: "Advanced Gemini model (Google)", provider: "gemini" },
    { id: 3, name: "gemini-2.5-flash", desc: "Advanced Gemini model (Google)", provider: "gemini" },
];

export default function Preferences() {
    const { aiModel, setAiModel } = useAiModel();

    return (
        <div className="w-full h-[calc(100dvh-52px)] px-4 sm:px-6 md:px-8 ">
            {/* Appearance Section */}
            <section className="mb-10">
                <h1 className="text-xl md:text-lg font-semibold text-dark">Preferences</h1>
                <div className="border-t border-theme my-4"></div>
                <div className="flex flex-row items-center justify-between">
                    <div>
                        <p className="text-dark text-[17px] md:text-sm">Appearance</p>
                        <p className="text-muted text-sm md:text-xs">
                            How Perplexity looks on your device
                        </p>
                    </div>
                    <ThemeToggle />
                </div>
            </section>

            {/* AI Section */}
            <section>
                <h2 className="text-xl md:text-lg font-semibold text-dark">Artificial Intelligence</h2>
                <div className="border-t border-theme my-4"></div>

                {/* Model Selection */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
                    <div>
                        <p className="text-[17px] md:text-sm text-dark">Model</p>
                        <p className="text-muted text-sm md:text-xs">
                            Now includes Claude 4.0, GPT-4.1, and Sonar
                        </p>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="text-sm md:text-xs text-muted border border-theme rounded-sm px-3 py-1 hover:bg-secondary w-fit transition-colors bg-pHover-hover">
                                {aiModel ? aiModel : "Choose here"}
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-64 bg-secondary border border-theme text-dark rounded-lg shadow-lg transition-colors duration-300">
                            {AIModelsOption.map((model) => {
                                const isSelected = aiModel === model.name;
                                return (
                                    <DropdownMenuItem
                                        key={model.id}
                                        onClick={() => setAiModel(model.name)}
                                        className={`flex flex-col justify-start gap-1 py-2 px-3 rounded-lg cursor-pointer transition-colors duration-200 ${isSelected
                                            ? "bg-accent text-white"
                                            : "hover:bg-accent hover:text-dark text-muted"
                                            }`}
                                    >
                                        <div className="flex justify-between w-full items-center">
                                            <h2 className="text-sm font-medium">{model.name}</h2>
                                            {isSelected && <span className="text-xs">✔</span>}
                                        </div>
                                        {model.desc && (
                                            <p className="text-xs text-muted w-full justify-start">{model.desc}</p>
                                        )}
                                    </DropdownMenuItem>
                                );
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </section>
        </div>
    );
}
