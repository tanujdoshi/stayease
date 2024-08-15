import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {IoClose} from 'react-icons/io5';
import {FaDollarSign} from 'react-icons/fa';
import {MdFamilyRestroom} from 'react-icons/md';

import {IoHome} from 'react-icons/io5';

import {FaExternalLinkAlt} from 'react-icons/fa';
import {database} from '@/lib/data';
import {useParams} from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {addDays, intervalToDuration} from 'date-fns';
import {useState} from 'react';
import {DatePickerWithRange} from '@/components/date-range-picker';
import {Slider} from '@/components/ui/slider';
import {Checkbox} from '@/components/ui/checkbox';
import {Separator} from '@/components/ui/separator';

export const BookedProperty = () => {
  const {propertyId} = useParams();

  const [date, setDate] = useState<[Date?, Date?]>([
    new Date(),
    addDays(new Date(), 7),
  ]);

  const intervalDuration =
    date[0] &&
    date[1] &&
    intervalToDuration({
      start: date[0],
      end: date[1],
    });

  const [guests, setGuests] = useState(2);

  if (!propertyId) {
    throw new Error('Invalid Property');
  }

  const property = database.find((data) => data.id === propertyId);

  if (!property) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <h1 className="text-4xl font-semibold">❌ Property Not Found.</h1>
      </div>
    );
  }

  return (
    <>
      <div className="container lg:w-8/12 mt-5">
        <Carousel>
          <CarouselContent>
            {property.images.map((image) => (
              <CarouselItem key={image.id}>
                <div className="flex justify-center h-full">
                  <img src={image} className="object-cover" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <div className="container lg:w-8/12 my-10">
        <div className="flex flex-col md:flex-row">
          <div>
            <span className="text-xs flex items-center gap-2 mb-2">
              📍 {property.location}{' '}
              <a
                href={`http://maps.google.com/?q=${property.location}`}
                target="_blank"
              >
                <FaExternalLinkAlt />
              </a>
            </span>
            <h1 className="text-2xl font-bold">{property.title}</h1>
            <p className="text-zinc-500">{property.description}</p>
          </div>

          <div className="md:w-6/12 md:ml-auto mt-5 md:mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  $ {property.price.value} / {property.price.base}
                </CardTitle>
              </CardHeader>
              <CardFooter>
                <Sheet>
                  <SheetTrigger className="w-full">
                    <Button className="w-full">
                      <IoHome className="mr-2" />
                      Reserve
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="xl:w-[500px] xl:max-w-none sm:w-[400px] sm:max-w-[540px]">
                    <SheetHeader>
                      <SheetTitle>Make Reservation</SheetTitle>
                      <SheetDescription>
                        <div className="flex gap-2 mt-5 flex-col">
                          <label>Check In - Check Out</label>
                          <DatePickerWithRange
                            dateRange={date}
                            setDateRange={(range) =>
                              setDate([range?.from, range?.to])
                            }
                          />
                        </div>

                        <div className="flex flex-col gap-3 mt-8">
                          <label className="flex gap-2 items-center">
                            <MdFamilyRestroom className="text-xl" /> Guests -{' '}
                            {guests}
                          </label>
                          <Slider
                            value={[guests]}
                            onValueChange={(value) => setGuests(value[0])}
                            min={1}
                            max={10}
                            step={1}
                          />
                        </div>

                        {(property?.amenitiesExclusions?.length || 0) > 0 && (
                          <div className="flex flex-col gap-3 mt-8">
                            <label>Amenities Exclusion</label>
                            <div className="flex gap-5">
                              {property.amenitiesExclusions?.map(
                                (exclusion) => (
                                  <div className="flex items-center gap-2">
                                    <Checkbox
                                      key={exclusion}
                                      icon={<IoClose />}
                                    />
                                    <span className="text-sm">{exclusion}</span>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                        <Card className="mt-8">
                          <CardHeader>
                            <CardTitle className="text-2xl">Total</CardTitle>
                            <Separator />
                          </CardHeader>
                          <CardContent>
                            <span>
                              $ {property.price.value} / {property.price.base} *{' '}
                              {intervalDuration?.days || 0} Nights
                            </span>
                          </CardContent>
                          <CardFooter>
                            <Button className="w-full">
                              <FaDollarSign />
                              {property.price.value *
                                (intervalDuration?.days || 0)}
                              <span className="ml-3">Pay Now</span>
                            </Button>
                          </CardFooter>
                        </Card>
                      </SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};