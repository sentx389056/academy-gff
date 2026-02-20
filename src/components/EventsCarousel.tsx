"use client";

import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Event {
  id: number;
  title: string;
  slug: string;
  date: Date | string;
  image: string | null;
  location: string | null;
}

interface Props {
  events: Event[];
}

export default function EventsCarousel({ events }: Props) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 text-sm">
        <p>События скоро появятся</p>
      </div>
    );
  }

  return (
    <Carousel
      opts={{ align: "start", loop: false }}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {events.map((event) => (
          <CarouselItem key={event.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
            <Link href={`/events/${event.slug}`}>
              <article className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow group h-full flex flex-col">
                {event.image ? (
                  <img src={event.image} alt={event.title} className="w-full h-44 object-cover" />
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-red-800 text-white text-center rounded px-2 py-1 min-w-[40px] flex-shrink-0">
                      <div className="text-sm font-bold leading-none">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-xs mt-0.5">
                        {new Date(event.date).toLocaleDateString("ru-RU", { month: "short" })}
                      </div>
                    </div>
                    {event.location && (
                      <span className="text-xs text-slate-400 truncate">{event.location}</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-red-800 transition-colors text-sm flex-1">
                    {event.title}
                  </h3>
                </div>
              </article>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-4 bg-white border-slate-200 hover:bg-slate-50 text-slate-700" />
      <CarouselNext className="-right-4 bg-white border-slate-200 hover:bg-slate-50 text-slate-700" />
    </Carousel>
  );
}
