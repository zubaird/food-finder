class EventsController < ApplicationController


  def home

  end

  def nullimage
    render :json => "http://lorempixel.com/output/animals-q-c-216-204-3.jpg"
  end


end
