require 'rails_helper'


describe "visit home page" do

  it "works" do
    visit "/"

    expect(page).to have_content("free")
  end

end
