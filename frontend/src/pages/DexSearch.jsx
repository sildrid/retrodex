
import './DexSearch.css';
import {useState,useEffect} from 'react';

import MonList from "../components/DexSearch/MonList.jsx";
import TypeList from "../components/DexSearch/TypeList.jsx";
import MoveList from "../components/DexSearch/MoveList.jsx";

export default function(props){
  const [filterMon,setFilterMon] = useState([]);
  const [filterTypes,setFilterTypes] = useState([]);
  const [filterAbilities,setFilterAbilities] = useState([]);

  const [searchOption, setSearchOption] = useState("name");
  const [advancedOption, setAdvancedOption] = useState(false);

  const [moveSearchName, setMoveSearchName] = useState("");
  const [moveSearchTypes,setMoveSearchTypes] = useState([]);
  const [moveSearchCategory, setMoveSearchCategory] = useState("");

  useEffect(()=>{
    setFilterMon(props.data.pokemon || []);
    setFilterTypes(props.data.types || []);
    setFilterAbilities(props.data.abilities || []);
  }, [props.data]);

  useEffect(()=>{
    if(props.data.types){
      const filteredMoveTypes = moveSearchTypes.length>0?
        props.data.types.filter(n=>{
          return moveSearchTypes.find(x=>x===n.name);
        }):
        [...props.data.types];

      const filteredMoveCategories = moveSearchCategory ?
        filteredMoveTypes.map(type=>{
          const updatedType = {...type};
          updatedType.moves = type.moves.filter(mov=>mov.class==moveSearchCategory);
          return updatedType
        }):
        filteredMoveTypes.map(type=>{
          const updatedType = {...type};
          updatedType.moves = [...type.moves]
          return updatedType
        });

      if(moveSearchName){
        filteredMoveCategories.forEach(type=>{
          type.moves = type.moves.filter(mov=>mov.name.includes(moveSearchName.toLowerCase()));
        });
      }
      setFilterTypes(filteredMoveCategories);
    }
  }, [moveSearchName,moveSearchTypes,moveSearchCategory]);

  const setOption = (e)=>{
    setSearchOption(e.target.value);
  }
  const monInputFilter = (e)=>{
    const monMatchArr = props.data.pokemon.filter(n=>{
      const matches = n.name.includes(e.target.value.toLowerCase()) || n.id.includes(e.target.value.toLowerCase());
      return matches
    });
    setFilterMon(monMatchArr);
  }

  const moveInputFilter = (e)=>{
    setMoveSearchName(e.target.value)
  }
  const updateTypeCheckboxes = (e)=>{
    const checkedNode = document.querySelectorAll(".type-filter-list input:checked");
    const checkedArr = [...checkedNode].map(n=>n.value);
    setMoveSearchTypes(checkedArr);
  }
  const moveCategoryFilter = (e)=>{
    setMoveSearchCategory(e.target.value)
  }

  const abilityInputFilter = (e)=>{
    const abilityMatchArr = props.data.abilities.filter(n=>{
      return n.name.includes(e.target.value.toLowerCase());
    });
    setFilterAbilities(abilityMatchArr);
  }

  return(
    <>
      <form className="dex-search-form">  
        <h3>Search:</h3>
        <div className="search-options">
          <input
            id="search-by-name"
            name="search-by"
            type="radio" value="name"
            onChange={setOption}
            defaultChecked
          />
          <label htmlFor="search-by-name">Name/Nº</label>
          <input
            id="search-by-type"
            name="search-by"
            type="radio"
            value="type"
            onChange={setOption}
          />
          <label htmlFor="search-by-type">Type</label>
          <input
            id="search-by-move"
            name="search-by"
            type="radio"
            value="move"
            onChange={setOption}
          />
          <label htmlFor="search-by-move">Move</label>
          <input
            id="search-by-ability"
            name="search-by"
            type="radio"
            value="ability"
            onChange={setOption}/>
          <label htmlFor="search-by-ability">Ability</label>
        </div>
        <div className="search-input">
          {(searchOption === "name" &&
            <input type="text" placeholder="search by name or number" onChange={monInputFilter}/>
          )}
          {(searchOption === "move" &&
            <div>
              <input type="text" placeholder="search a move" onChange={moveInputFilter}/>
              <ul className="advanced-button-wrapper">
                <li>
                  <input id="advanced-toggle" type="checkbox" onChange={(e)=>{setAdvancedOption(e.target.checked)}}/>
                  <label htmlFor="advanced-toggle">
                    Advanced
                  </label>
                </li>
              </ul>
              {(advancedOption &&
              <>
              <hr/>
              <ul className="type-filter-list">
                {props.data.types.map(n=>{
                  return (
                    <li key={n.name+"-key"} >
                      <input
                        id={"type-filter-"+n.name}
                        name="type-filter"
                        type="checkbox"
                        value={n.name}
                        onChange={updateTypeCheckboxes}
                      />
                      <label
                        className={n.name+"-bg"}
                        htmlFor={"type-filter-"+n.name}
                      >
                        {n.name.slice(0,3)}
                      </label>
                    </li>)
                })}
              </ul>
              <hr/>
              <ul>
                <li>
                  <input
                    id="no-category-filter"
                    name="category-filter"
                    type="radio" value=""
                    onChange={moveCategoryFilter}
                    defaultChecked
                  />
                  <label htmlFor="no-category-filter">All</label>
                </li>
                <li>
                  <input
                    id="physical-category-filter"
                    name="category-filter"
                    type="radio" value="physical"
                    onChange={moveCategoryFilter}
                  />
                  <label htmlFor="physical-category-filter">Physical</label>
                </li>
                <li>
                  <input
                    id="special-category-filter"
                    name="category-filter"
                    type="radio" value="special"
                    onChange={moveCategoryFilter}
                  />
                  <label htmlFor="special-category-filter">Special</label>
                </li>
                <li>
                  <input
                    id="status-category-filter"
                    name="category-filter"
                    type="radio" value="status"
                    onChange={moveCategoryFilter}
                  />
                  <label htmlFor="status-category-filter">Status</label>
                </li>
              </ul>
              </>
              )}
            </div>
          )}
          {(searchOption === "ability" &&
            <input type="text" placeholder="search an ability" onChange={abilityInputFilter}/>
          )}
        </div>
      </form>
      {searchOption === "name" &&
        <MonList list={filterMon}/>
      }
      {searchOption === "type" &&
        <TypeList list={props.data.types}/>
      }
      {searchOption === "move" &&
        <MoveList list={filterTypes}/>
      }
      <ul className="dex-search-moves">
        {(searchOption === "ability" &&
          filterAbilities.map(n=>{
            return (
              <li>
                <h3>{n.name}</h3>
                <p>{n.effect}</p>
              </li>
            )
          })
        )}
      </ul>
    </>
  )

}
